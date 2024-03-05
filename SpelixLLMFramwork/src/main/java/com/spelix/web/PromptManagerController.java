package com.spelix.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spelix.config.ApplicationConfig;
import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptRateHistoryDTO;
import com.spelix.domain.PromptTestDataDTO;
import com.spelix.service.PromptManagerService;

@Controller
//@RequestMapping("/promptmanager")
public class PromptManagerController {

	private static final Logger log = LoggerFactory.getLogger(PromptManagerController.class);

	private final ApplicationConfig applicationConfig;
	private final PromptManagerService promptManagerService;

	@Autowired
	public PromptManagerController(PromptManagerService promptManagerService, ApplicationConfig applicationConfig) {
		this.promptManagerService = promptManagerService;
		this.applicationConfig = applicationConfig;
	}

	@GetMapping("/promptmanager")
	public String promptmanager(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "promptmanager";
	}

	@RequestMapping(value = "/promptmanager/getAllPromptMaster.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptMasterDTO> getAllPromptMaster() {
		List<PromptMasterDTO> allPromptMasterList = promptManagerService.getAllPromptMaster();

		log.debug("getAllPromptMaster allPromptMasterList: " + allPromptMasterList);

		return allPromptMasterList;
	}

	@RequestMapping(value = "/promptmanager/deletePromptMasterById.do", method = RequestMethod.POST)
	@ResponseBody
	public int deletePromptMasterById(@RequestParam("promptId") String promptId) {
		log.debug("deletePromptMasterById promptId: " + promptId);
		return promptManagerService.deletePromptMasterById(promptId);
	}

	@RequestMapping(value = "/promptmanager/getAllPromptModelList.do", method = RequestMethod.POST)
	@ResponseBody
	public List<ModelMasterDTO> getAllPromptModelList() {

		List<ModelMasterDTO> promptModelList = promptManagerService.getAllPromptModelList();

		log.debug("getAllPromptModelList promptModelList: " + promptModelList);

		return promptModelList;
	}

	@RequestMapping(value = "/promptmanager/updateUseYNPromptMaster.do", method = RequestMethod.POST)
	@ResponseBody
	public int updateUseYNPromptMaster(@RequestParam("promptId") String promptId) {
		log.debug("updateUseYNPromptMaster promptId: " + promptId);

		return promptManagerService.updateUseYNPromptMaster(promptId);
	}

	@RequestMapping(value = "/promptmanager/getPromptTestDataResultById.do", method = RequestMethod.POST)
	@ResponseBody
	public List<Map<String, Object>> getPromptTestDataResultById( //
			@RequestParam("requestParam") String requestParam, //
			@RequestParam("promptTestId") String promptTestId, //
			@RequestParam("promptId") String promptId, //
			@RequestParam("promptVer") String promptVer) {

		List<PromptTestDataDTO> promptTestDataResultList = getPromptTestDataById(promptTestId);
		JSONArray jsonArray = new JSONArray();

		Map<String, PromptTestDataDTO> tempDtoMap = new HashMap<String, PromptTestDataDTO>();

		for (PromptTestDataDTO promptTestDataDTO : promptTestDataResultList) {

			PromptRateHistoryDTO promptRateHistoryDTO = new PromptRateHistoryDTO();
			JSONObject requestParamJson = new JSONObject(requestParam);

			String prompt = requestParamJson.getString("prompt");

			// 새로운 키와 값을 추가
			requestParamJson.put("prompt", prompt + "\n" + promptTestDataDTO.getBody());
			requestParamJson.put("answer", promptTestDataDTO.getAnswer());

			String nextHistoryId = getPromptRateHistoryNextHistoryId();
			log.debug("nextHistoryId: " + nextHistoryId);
			requestParamJson.put("prompt_id", nextHistoryId);

			jsonArray.put(requestParamJson);

			// 검증화면 아이디, 프롬프트, 정답 입력 위해서
			tempDtoMap.put(nextHistoryId, promptTestDataDTO);

			// TODO save history
			promptRateHistoryDTO.setPromptRateHistId(nextHistoryId);
			promptRateHistoryDTO.setPromptId(promptId);
			promptRateHistoryDTO.setPromptVer(promptVer);
			promptRateHistoryDTO.setPrompt(prompt);
//			promptRateHistoryDTO.getSysPromptIds()
//			promptRateHistoryDTO.setSysPromptEtc(requestParamJson.getString(""));
//			promptRateHistoryDTO.setParmJson();

			int success = savePromptRateHistory(promptRateHistoryDTO);
		}

		log.debug("getPromptTestDataResultById jsonArray: " + jsonArray);

		List<Map<String, Object>> modelResponseList = getModelResponse(jsonArray);

		for (Map<String, Object> map : modelResponseList) {
			map.put("question", tempDtoMap.get(map.get("prompt_id")).getBody());
			map.put("answer", tempDtoMap.get(map.get("prompt_id")).getAnswer());

			// update history
			updatePromptRateHistoryRate((String) map.get("prompt_id"),
					((Number) map.get("answer_cosine_similarity")).doubleValue());
		}
		log.debug("modelResponseList: " + modelResponseList);

		return modelResponseList;

	}

	private List<PromptTestDataDTO> getPromptTestDataById(String promptTestId) {
		List<PromptTestDataDTO> promptTestDataList = promptManagerService.getPromptTestDataById(promptTestId);

		log.debug("getPromptTestDataById promptTestDataList: " + promptTestDataList);

		return promptTestDataList;
	}

	private List<Map<String, Object>> getModelResponse(JSONArray jsonArray) {

		StringBuilder apiUrl = new StringBuilder();
		apiUrl.append("http://").append(applicationConfig.getHost());
		apiUrl.append(":").append(applicationConfig.getPort());
		apiUrl.append("/").append(applicationConfig.getPath());

		log.debug("apiUrl: " + apiUrl);

		JSONObject sp_route = new JSONObject();
		sp_route.put("sp_route", jsonArray.toString());

		log.debug("sp_route: " + sp_route);

		String result = getApiResultJsonStr(apiUrl.toString(), sp_route.toString());

		log.debug("result: " + result);

		JSONObject resultJson = new JSONObject(result);
		JSONArray list = resultJson.getJSONArray("sp_wex_output");

		log.debug("list: " + list);

		List<Map<String, Object>> responseMap = new ArrayList<Map<String, Object>>();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			responseMap = objectMapper.readValue(list.toString(), List.class);
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		log.debug("responseMap: " + responseMap);

		return responseMap;
	}

	private String getApiResultJsonStr(String apiUrl, String inputString) {

		StringBuilder response = new StringBuilder();

		try {
			URL url = new URL(apiUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			conn.setRequestProperty("Accept", "application/json");
			conn.setDoOutput(true);

			try (OutputStream os = conn.getOutputStream()) {
				byte[] input = inputString.getBytes("utf-8");
				os.write(input, 0, input.length);
			}

			try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					response.append(responseLine);
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		return response.toString();
	}

	@RequestMapping(value = "/promptmanager/getPromptRateHistoryByPromptId.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptRateHistoryDTO> getPromptRateHistoryByPromptId(@RequestParam("promptId") String promptId) {
		List<PromptRateHistoryDTO> history = promptManagerService.getPromptRateHistoryByPromptId(promptId);

		log.debug("getPromptRateHistoryByPromptId: " + history);

		return history;
	}

	public int savePromptRateHistory(PromptRateHistoryDTO promptRateHistoryDTO) {
		log.debug("savePromptRateHistory");

		return promptManagerService.savePromptRateHistory(promptRateHistoryDTO);
	}

	public String getPromptRateHistoryNextHistoryId() {
		String historyId = promptManagerService.getPromptRateHistoryNextHistoryId();

		log.debug("next historyId: " + historyId);

		return historyId;
	}

	public int updatePromptRateHistoryRate(String promptRateHistId, double promptRate) {
		log.debug("updatePromptRateHistoryRate");

		return promptManagerService.updatePromptRateHistoryRate(promptRateHistId, promptRate);
	}
}
