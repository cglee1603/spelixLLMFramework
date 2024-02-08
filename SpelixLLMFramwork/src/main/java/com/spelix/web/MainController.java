package com.spelix.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spelix.domain.ModelMasterDTO;
import com.spelix.domain.ParameterMasterDTO;
import com.spelix.domain.PromptBaseDTO;
import com.spelix.domain.PromptMasterDTO;
import com.spelix.domain.PromptSystemDTO;
import com.spelix.service.PlaygroundService;

@Controller
public class MainController {

	private static final Logger log = LoggerFactory.getLogger(MainController.class);

	// FIXME
	private static String HOST_IP = "192.168.122.26";
	private static String HOST_MURDER_PORT = "5000";

	private final PlaygroundService playgroundService;

	@Autowired
	public MainController(PlaygroundService playgroundService) {
		this.playgroundService = playgroundService;
	}

	@RequestMapping("/home")
	public String home() {
		return "home";
	}

	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "main";
	}

	@RequestMapping(value = "/playground", method = RequestMethod.GET)
	public String playground(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "playground";
	}

	@RequestMapping(value = "/playgroundprompt", method = RequestMethod.GET)
	public String playgroundprompt(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "playgroundprompt";
	}

	@RequestMapping(value = "/playgroundchat", method = RequestMethod.GET)
	public String playgroundchat(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "playgroundchat";
	}

	// FIXME
	@RequestMapping(value = "getChatbotResponse.do")
	@ResponseBody
	public Map<String, Object> getChatbotResponse(@RequestParam("requestParam") String requestParam) {
		String apiUrl = "http://" + HOST_IP + ":" + HOST_MURDER_PORT + "/sp_demo";

		log.debug("apiUrl: " + apiUrl);
		log.debug("requestParam: " + requestParam);

		JSONObject requestParamJson = new JSONObject(requestParam);
		JSONObject sp_route = new JSONObject();

		sp_route.put("sp_route", requestParamJson);

		String result = getApiResultJsonStr(apiUrl, sp_route.toString());

		log.debug("result: " + result);

		JSONObject resultJson = new JSONObject(result);
		JSONArray list = resultJson.getJSONArray("sp_wex_output");

		log.debug("list: " + list);
		log.debug("list.getJSONObject(0): " + list.getJSONObject(0));

		Map<String, Object> responseMap = new HashMap<String, Object>();
		try {
			responseMap = new ObjectMapper().readValue(list.getJSONObject(0).toString(), Map.class);
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

//TODO name 변경
	@RequestMapping(value = "/selectPromptSample.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptBaseDTO> selectPromptSample() {

		List<PromptBaseDTO> promptBaseDTOList = playgroundService.getAllPromptBase();

		log.debug("selectPromptSample: " + promptBaseDTOList);

		return promptBaseDTOList;
	}

	@RequestMapping(value = "/getPromptSystemInfo.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptSystemDTO> getPromptSystemInfo() {

		List<PromptSystemDTO> promptSystemInfo = playgroundService.getPromptSystemInfo();

		log.debug("promptSystemInfo: " + promptSystemInfo);

		return promptSystemInfo;
	}

	@RequestMapping(value = "/getPromptMaster.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptMasterDTO> getPromptMaster() {

		List<PromptMasterDTO> promptMasterDTOList = playgroundService.getAllPromptMaster();

		log.debug("getPromptMaster: " + promptMasterDTOList);

		return promptMasterDTOList;
	}

	@RequestMapping(value = "/getAllPromptModelList.do", method = RequestMethod.POST)
	@ResponseBody
	public List<ModelMasterDTO> getAllPromptModelList() {

		List<ModelMasterDTO> promptModelList = playgroundService.getAllPromptModelList();

		log.debug("getPromptModel: " + promptModelList);

		return promptModelList;
	}

	@RequestMapping(value = "/getParamMasterByParamId.do", method = RequestMethod.POST)
	@ResponseBody
	public List<ParameterMasterDTO> getParamMasterByParamId(
			@RequestParam("selectedModelTypeName") String selectedModelTypeName) {

		List<ParameterMasterDTO> paramMasterByParamId = playgroundService
				.getParamMasterByParamId(selectedModelTypeName);

		log.debug("getParamMasterByParamId: " + paramMasterByParamId);

		return paramMasterByParamId;
	}

	@RequestMapping(value = "/savePromptMaster.do", method = RequestMethod.POST)
	@ResponseBody
	public int savePromptMaster(PromptMasterDTO promptMasterDTO) {
		
		return playgroundService.savePromptMaster(promptMasterDTO);

	}
}
