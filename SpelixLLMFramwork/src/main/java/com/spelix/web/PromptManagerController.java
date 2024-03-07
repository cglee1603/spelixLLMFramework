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
import com.spelix.domain.PromptResultDTO;
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

	// TODO 프롬프트 마스터에서 삭제할 때 테스트데이터랑 히스토리, 결과 테이블 다 지워야하나?
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
	public String updateUseYNPromptMaster( //
			@RequestParam("promptId") String promptId, //
			@RequestParam("useYN") String useYN) {
		log.debug("updateUseYNPromptMaster promptId: " + promptId + ", useYN: " + useYN);

		int result = promptManagerService.updateUseYNPromptMaster(promptId, useYN);

		return result > 0 ? useYN : "Error"; // 성공하면 새 useYN 값을 반환, 아니면 에러 메시지 반환
	}

	@RequestMapping(value = "/promptmanager/getPromptTestDataResultById.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptRateHistoryDTO> getPromptTestDataResultById( //
			@RequestParam("requestParam") String requestParam, //
			@RequestParam("promptTestId") String promptTestId, //
			@RequestParam("promptId") String promptId, //
			@RequestParam("promptVer") String promptVer, //
			@RequestParam("sysPromptIds") String sysPromptIds, //
			@RequestParam("sysPromptEtc") String sysPromptEtc, //
			@RequestParam("promptType") String promptType) {

		log.debug("sysPromptIds: " + sysPromptIds);

		List<PromptTestDataDTO> promptTestDataList = getPromptTestDataById(promptTestId);
		JSONArray jsonArray = new JSONArray();

		PromptRateHistoryDTO promptRateHistoryDTO = new PromptRateHistoryDTO();
		PromptResultDTO promptResultDTO = new PromptResultDTO();

		String nextHistoryId = getPromptRateHistoryNextHistoryId();
		double cosSum = 0;
		int cnt = 1;

		log.debug("promptTestDataList: " + promptTestDataList);

		Map<Integer, PromptTestDataDTO> tempDtoMap = new HashMap<Integer, PromptTestDataDTO>();

		JSONObject requestParamJsonOrigin = new JSONObject(requestParam);
		log.debug("requestParamJsonOrigin: " + requestParamJsonOrigin);

		for (PromptTestDataDTO promptTestDataDTO : promptTestDataList) {
			JSONObject requestParamJson = new JSONObject(requestParam);
			String prompt = requestParamJson.getString("prompt");

			requestParamJson.put("prompt", prompt + "\n" + promptTestDataDTO.getBody());
			requestParamJson.put("answer", promptTestDataDTO.getAnswer());
			requestParamJson.put("prompt_id", promptTestDataDTO.getNum());
			jsonArray.put(requestParamJson);

			tempDtoMap.put(promptTestDataDTO.getNum(), promptTestDataDTO);

			cnt++;

		}

		log.debug("getPromptTestDataResultById jsonArray: " + jsonArray);
		log.debug("tempDtoMap: " + tempDtoMap);

		List<Map<String, Object>> modelResponseList = getModelResponse(jsonArray);
		log.debug("modelResponseList: " + modelResponseList);

		for (Map<String, Object> map : modelResponseList) {
			log.debug("map: " + map);

			double answerCosineSimilarity = ((Number) map.get("answer_cosine_similarity")).doubleValue();
			cosSum = cosSum + answerCosineSimilarity;
			log.debug("answerCosineSimilarity: " + answerCosineSimilarity);

			// save prompt result
			promptResultDTO.setPromptId(promptId);
			promptResultDTO.setPromptVer(promptVer);
			promptResultDTO.setPromptRateHistId(nextHistoryId);
			promptResultDTO.setModel(requestParamJsonOrigin.getString("model"));
			promptResultDTO.setPromptType(promptType);
			promptResultDTO.setPrompt(requestParamJsonOrigin.getString("prompt"));
			promptResultDTO.setBody(tempDtoMap.get(map.get("prompt_id")).getBody());
			promptResultDTO.setExpectResult(tempDtoMap.get(map.get("prompt_id")).getAnswer());
			promptResultDTO.setResult((String) map.get("prompt_result"));

			// FIXME 정답률 기준
			if (tempDtoMap.get(map.get("prompt_id")).getAnswer() != null) {
				promptResultDTO.setCortYn((answerCosineSimilarity >= 0.2) ? "Y" : "N");
			}

			promptResultDTO.setParmJson(requestParamJsonOrigin.get("properties").toString());
			log.debug("promptResultDTO: " + promptResultDTO);

			int success = savePromptResult(promptResultDTO);
			log.debug("savePromptResult success: " + success);

		}
		log.debug("cosSum: " + cosSum);
		log.debug("modelResponseList: " + modelResponseList);

		double promptRate = (double) cosSum / cnt;
		log.debug("promptRate: " + promptRate);

		// save prompt rate history
		promptRateHistoryDTO.setPromptRateHistId(nextHistoryId);
		promptRateHistoryDTO.setPromptId(promptId);
		promptRateHistoryDTO.setPromptVer(promptVer);
		promptRateHistoryDTO.setPrompt(requestParamJsonOrigin.getString("prompt"));
		promptRateHistoryDTO.setSysPromptIds(sysPromptIds.isEmpty() ? null : sysPromptIds.split(","));
		promptRateHistoryDTO.setSysPromptEtc(sysPromptEtc);
		promptRateHistoryDTO.setParmJson(requestParamJsonOrigin.get("properties").toString());
		promptRateHistoryDTO.setPromptRate(promptRate);
		log.debug("promptRateHistoryDTO: " + promptRateHistoryDTO);

		int success = savePromptRateHistory(promptRateHistoryDTO);
		log.debug("savePromptRateHistory success: " + success);

		// TODO update promptRate to prompt master
		success = updatePromptMasterPromptRateById(promptId, promptRate);
		log.debug("updatePromptMasterPromptRateById success: " + success);

		List<PromptRateHistoryDTO> resultList = new ArrayList<>();
		resultList.add(promptRateHistoryDTO);

		return resultList;

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
	public List<PromptRateHistoryDTO> getPromptRateHistoryByPromptId( //
			@RequestParam("promptId") String promptId, //
			@RequestParam("promptVer") String promptVer) {

		List<PromptRateHistoryDTO> history = promptManagerService.getPromptRateHistoryByPromptId(promptId, promptVer);

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

	@RequestMapping(value = "/promptmanager/getPromptResultByHistoryId.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptResultDTO> getPromptResultByHistoryId(@RequestParam("promptRateHistId") String promptRateHistId) {

		List<PromptResultDTO> resultList = promptManagerService.getPromptResultByHistoryId(promptRateHistId);

		log.debug("getPromptResultByHistoryId: " + resultList);

		return resultList;
	}

	public int savePromptResult(PromptResultDTO promptResultDTO) {
		log.debug("savePromptResult");

		return promptManagerService.savePromptResult(promptResultDTO);
	}

	public int updatePromptMasterPromptRateById(String promptId, double promptRate) {
		log.debug("savePromptMasterPromptRateById");

		return promptManagerService.updatePromptMasterPromptRateById(promptId, promptRate);
	}
}
