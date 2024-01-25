package com.spelix.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.spelix.domain.LLMSimilarInfoCondDTO;
import com.spelix.domain.PromptBaseDTO;
import com.spelix.service.PlaygroundService;

@Controller
public class MainController {

	private static final Logger log = LoggerFactory.getLogger(MainController.class);

	// FIXME
	private static String HOST_IP = "127.0.0.1";
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

	// FIXME
	@RequestMapping(value = "/main", method = RequestMethod.GET)
	public String main(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "main";
	}

	// FIXME
	@RequestMapping(value = "/playground", method = RequestMethod.GET)
	public String playground(Locale locale, Model model) {
		model.addAttribute("serverTime", "");

		return "playground";
	}

	@RequestMapping(value = "getLLMChatbot.do")
	@ResponseBody
	public HashMap<String, Object> getLLMChatbot(LLMSimilarInfoCondDTO conditionDTO) {
		String apiUrl = "http://" + HOST_IP + ":" + HOST_MURDER_PORT + "/sp_demo";

		JSONObject obj = new JSONObject();
		JSONObject sp_route = new JSONObject();

		sp_route.put("sp_category", "model_1");
		JSONArray array = new JSONArray();
		if (conditionDTO.getSp_file_name() != null && conditionDTO.getSp_file_name().size() > 0) {
			for (String val : conditionDTO.getSp_file_name()) {
				array.put(val);
			}
			sp_route.put("sp_type", "use_for");
		} else
			sp_route.put("sp_type", "not_use_for");
		sp_route.put("sp_file_name", array);

		sp_route.put("sp_previous_message", conditionDTO.getSp_previous_message());
		sp_route.put("sp_body", conditionDTO.getSp_body());

		obj.put("sp_route", sp_route);

		String result = getApiResultJsonStr(apiUrl, obj.toString());
//		String result = "{  \"sp_wex_output\": [    {      \"chunk_meta\": [        [          {            \"clause\": \"\\uc81c4\\uc870(\\ubcf4\\ud5d8\\uae08\\uc758 \\uc9c0\\uae09\\uc0ac\\uc720)\",             \"doc\": \"\\u2460 \\ud53c\\ubcf4\\ud5d8\\uc790\\uac00 \\uc774 \\ud2b9\\uc57d\\uc758 \\ubcf4\\ud5d8\\uae30\\uac04 \\uc911\\uc5d0 \\ubcf4\\uc7a5\\uac1c\\uc2dc\\uc77c \\uc774\\ud6c4\\uc5d0 '\\uc554', '\\uae30\\ud0c0\\ud53c\\ubd80\\uc554' \\ub610\\ub294 '\\uac11\\uc0c1\\uc120\\uc554'\\uc73c\\ub85c \\uc9c4\\ub2e8\\n\\ud655\\uc815\\ub418\\uace0 \\uadf8 \\uce58\\ub8cc\\ub97c \\uc9c1\\uc811\\uc801\\uc778 \\ubaa9\\uc801\\uc73c\\ub85c '\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc'\\ub97c \\ubc1b\\uc740 \\uacbd\\uc6b0\\uc5d0 \\ud68c\\uc0ac\\ub294 \\uc544\\ub798\\uc758 \\uae08\\uc561\\uc744 \\uacc4\\n\\uc18d\\ubc1b\\ub294\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\uc774\\ud558 '\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44'\\ub77c \\ud569\\ub2c8\\ub2e4)\\ub85c \\ubcf4\\ud5d8\\uc218\\uc775\\uc790\\uc5d0\\uac8c \\uc9c0\\uae09\\ud569\\ub2c8\\ub2e4.\\n'\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\ucd5c\\ucd081\\ud68c\\ud55c)'\\n\\uc9c0\\uae09\\uae08\\uc561\\n\\ucd5c\\ucd08\\uacc4\\uc57d\\n\\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c \\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c\\n\\uad6c\\ubd84 \\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c \\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c\\n\\ubd80\\ud130 \\ubd80\\ud130 \\uac31\\uc2e0\\uacc4\\uc57d\\n\\ubd80\\ud130 \\ubd80\\ud130\\n90\\uc77c \\ucd08\\uacfc 180\\uc77c \\uc774\\uc0c1\\n90\\uc77c \\uc774\\ud558 1\\ub144 \\uc774\\uc0c1 \\ud2b9\\n180\\uc77c \\ubbf8\\ub9cc 1\\ub144 \\ubbf8\\ub9cc\\n\\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\ubcc4\\n15\\uc138 \\uc774 \\ubcf4\\uc7a5\\n\\ud45c\\uc801 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\uc57d\\n\\ubbf8\\ub9cc \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 25%\\n\\ud56d\\uc554 50% 100% 100% \\uad00\\n\\uc554\\n\\uc57d\\ubb3c \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5\\n15\\uc138\\n\\ud5c8\\uac00 - \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758\\n\\uc774\\uc0c1\\n\\uce58\\ub8cc\\ube44 25% 50% 100% 100%\\n(\\ucd5c\\ucd081\\ud68c \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5\\n\\uae30\\ud0c0\\ud53c\\ubd80\\uc554 \\uc774 \\ubcf4\\uc7a5\\n\\ud55c) \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758\\n\\uac11\\uc0c1\\uc120\\uc554 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 25%\\n50% 100% 100%\\n'\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\uc5f0\\uac041\\ud68c\\ud55c)'\\n\\uc9c0\\uae09\\uae08\\uc561\\n\\ucd5c\\ucd08\\uacc4\\uc57d\\n\\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c \\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c\\n\\uad6c\\ubd84 \\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c \\ubcf4\\ud5d8\\uacc4\\uc57d\\uc77c\\ub85c\\n\\ubd80\\ud130 \\ubd80\\ud130 \\uac31\\uc2e0\\uacc4\\uc57d\\n\\ubd80\\ud130 \\ubd80\\ud130\\n90\\uc77c \\ucd08\\uacfc 180\\uc77c \\uc774\\uc0c1\\n90\\uc77c \\uc774\\ud558 1\\ub144 \\uc774\\uc0c1\\n180\\uc77c \\ubbf8\\ub9cc 1\\ub144 \\ubbf8\\ub9cc\\n\\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5\\n15\\uc138 \\uc774 \\ubcf4\\uc7a5\\n\\ud45c\\uc801 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758\\n\\ubbf8\\ub9cc \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 25%\\n\\ud56d\\uc554 50% 100% 100%\\n\\uc554\\n\\uc57d\\ubb3c \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5\\n15\\uc138\\n\\ud5c8\\uac00 - \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758\\n\\uc774\\uc0c1\\n\\uce58\\ub8cc\\ube44 25% 50% 100% 100%\\n(\\uc5f0\\uac041\\ud68c \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5 \\uc774 \\ubcf4\\uc7a5\\n\\uae30\\ud0c0\\ud53c\\ubd80\\uc554 \\uc774 \\ubcf4\\uc7a5\\n\\ud55c) \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758\\n\\uac11\\uc0c1\\uc120\\uc554 \\ubcf4\\ud5d8\\uac00\\uc785\\uae08\\uc561\\uc758 25%\\n50% 100% 100%\\n\\u2461 \\uc81c1\\ud56d\\uc5d0\\uc11c '\\uc5f0\\uac04'\\uc774\\ub780 \\uacc4\\uc57d\\uc77c\\ubd80\\ud130 \\ub9e41\\ub144 \\ub2e8\\uc704\\ub85c \\ub3c4\\ub798\\ud558\\ub294 \\uacc4\\uc57d\\ud574\\ub2f9\\uc77c \\uc804\\uc77c\\uae4c\\uc9c0 \\uae30\\uac04\\uc744 \\uc758\\ubbf8\\ud558\\uba70, \\ud55c\\ub3c4\\n169<Page:139> \\uc0b0\\uc815\\uc758 \\uae30\\uc900\\uc77c\\uc790\\ub294 '\\ud45c\\uc801\\ud56d\\uc554\\uc81c'\\ub97c \\ucc98\\ubc29\\ubc1b\\uace0 \\uc57d\\ubb3c\\uc774 \\ud22c\\uc5ec\\ub418\\uc5c8\\uc744 \\ub54c\\ub97c \\ub9d0\\ud558\\uba70, \\ucd5c\\ucd08\\ucc98\\ubc29\\uc77c\\uc790\\ub97c \\uae30\\uc900\\uc73c\\ub85c\\n\\ud569\\ub2c8\\ub2e4.\\n'\\uacc4\\uc18d\\ubc1b\\ub294\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44 \\ubcf4\\uc7a5 \\uc608\\uc2dc'\\n: \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\ucd5c\\ucd081\\ud68c\\ud55c) 900\\ub9cc\\uc6d0, \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\uc5f0\\uac041\\ud68c\\ud55c) 100\\ub9cc\\uc6d0 \\uac00\\uc785 \\uae30\\uc900\\n(\\ucd5c\\ucd08)\\uacc4\\uc57d\\uc77c \\uccab\\ubc88\\uc9f8 \\ucc98\\ubc29\\uc77c \\ucc98\\ubc29\\uc77c \\uac31\\uc2e0\\uc77c \\ucc98\\ubc29\\uc77c\\n(2020\\ub144 1\\uc6d4 1\\uc77c) (2023\\ub144 3\\uc6d4 1\\uc77c) (2025\\ub144 1\\uc6d4 1\\uc77c) (2030\\ub144 1\\uc6d4 1\\uc77c) (2031\\ub144 5\\uc6d4 1\\uc77c)\\n\\uc138\\ubd80\\ubcf4\\uc7a5\\n\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\n900\\ub9cc\\uc6d0 \\ucd5c\\ucd08 1\\ud68c \\uc9c0\\uae09\\n\\ud5c8\\uac00\\uce58\\ub8cc\\ube44\\n\\uc9c0\\uae09 \\ud6c4 \\uc18c\\uba78\\n(\\ucd5c\\ucd081\\ud68c\\ud55c)\\n\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\n100\\ub9cc\\uc6d0 100\\ub9cc\\uc6d0 100\\ub9cc\\uc6d0\\n\\ud5c8\\uac00\\uce58\\ub8cc\\ube44\\n\\uc9c0\\uae09 \\uc9c0\\uae09 \\uc9c0\\uae09\\n(\\uc5f0\\uac041\\ud68c\\ud55c)\\n\\uc5f0\\uac04 1\\ud68c \\ud55c\\ub3c4\\ub85c \\uacc4\\uc18d \\ubcf4\\uc7a5\\n\\uacc4\\uc18d\\ubc1b\\ub294\\n\\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c \\ucd1d 1,000\\ub9cc\\uc6d0 \\ucd1d 100\\ub9cc\\uc6d0 \\ucd1d 100\\ub9cc\\uc6d0\\n\\ud5c8\\uac00\\uce58\\ub8cc\\ube44 \\uc9c0\\uae09 \\uc9c0\\uae09 \\uc9c0\\uae09\",             \"key\": 399,             \"length\": 1426,             \"page\": \"<Page:138>\",             \"title\": \"01_allcare.pdf\"          }        ]      ],       \"sp_gen\": \"\\ud45c\\uc801\\ud56d\\uc554\\uce58\\ub8cc\\uc81c\\ub97c \\uc0ac\\uc6a9\\ud558\\uba74 \\ub2e4\\uc74c\\uacfc \\uac19\\uc740 \\ud61c\\ud0dd\\uc744 \\ubc1b\\uc744 \\uc218 \\uc788\\uc2b5\\ub2c8\\ub2e4.\\n\\n1. \\ucd5c\\ucd08 1\\ud68c \\uc9c0\\uae09: \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\ucd5c\\ucd081\\ud68c\\ud55c)\\uac00 900\\ub9cc\\uc6d0\\uc73c\\ub85c \\uc9c0\\uae09\\ub429\\ub2c8\\ub2e4.\\n2. \\uc5f0\\uac04 1\\ud68c \\ud55c\\ub3c4: \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44(\\uc5f0\\uac041\\ud68c\\ud55c)\\uac00 100\\ub9cc\\uc6d0\\uc73c\\ub85c \\uc9c0\\uae09\\ub429\\ub2c8\\ub2e4.\\n3. \\uacc4\\uc18d\\ubc1b\\ub294 \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44: \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44\\uac00 \\uc5f0\\uac04 1\\ud68c \\ud55c\\ub3c4\\ub85c \\uacc4\\uc18d \\ubcf4\\uc7a5\\ub429\\ub2c8\\ub2e4.\\n4. \\ud5c8\\uac00\\uce58\\ub8cc\\ube44 \\uc9c0\\uae09: \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44\\uac00 \\uc9c0\\uae09\\ub418\\uba74 \\ud6c4 \\uc18c\\uba78\\ub429\\ub2c8\\ub2e4.\\n\\n\\ub530\\ub77c\\uc11c, \\ud45c\\uc801\\ud56d\\uc554\\uce58\\ub8cc\\uc81c\\ub97c \\uc0ac\\uc6a9\\ud558\\uba74 \\ucd5c\\ucd08 1\\ud68c \\uc9c0\\uae09, \\uc5f0\\uac04 1\\ud68c \\ud55c\\ub3c4, \\uacc4\\uc18d\\ubc1b\\ub294 \\ud45c\\uc801\\ud56d\\uc554\\uc57d\\ubb3c\\ud5c8\\uac00\\uce58\\ub8cc\\ube44, \\ud5c8\\uac00\\uce58\\ub8cc\\ube44 \\uc9c0\\uae09 \\ub4f1\\uc758 \\ud61c\\ud0dd\\uc744 \\ubc1b\\uc744 \\uc218 \\uc788\\uc2b5\\ub2c8\\ub2e4.\"    }  ]}\n";
		System.out.println(result);

		JSONObject jObj = new JSONObject(result);
		JSONArray list = jObj.getJSONArray("sp_wex_output");

		System.out.println(list.getJSONObject(0));
		HashMap<String, Object> modelAndView = new HashMap<String, Object>();
		modelAndView.put("sp_gen", list.getJSONObject(0).get("sp_gen"));
		if (list.getJSONObject(0).has("chunk_meta"))
			modelAndView.put("chunk_meta", list.getJSONObject(0).get("chunk_meta").toString());
		modelAndView.put("data", list.getJSONObject(0).toString());

		return modelAndView;

	}

	private String getApiResultJsonStr(String apiUrl, String inputString) {
		String jsonStr = "";
		try {
//    		URL url = new URL ("http://"+HOST_IP+"/police_api");
			URL url = new URL(apiUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");

			conn.setRequestProperty("Content-Type", "application/json");
			conn.setRequestProperty("Accept", "application/json");

			conn.setDoOutput(true);

			String jsonInputString = inputString;
			System.out.println("input : " + jsonInputString);

			try (OutputStream os = conn.getOutputStream()) {
				byte[] input = jsonInputString.getBytes("utf-8");
				os.write(input, 0, input.length);
			}
			// System.out.println(code);
			StringBuilder response = new StringBuilder();
			try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
				String responseLine = null;
				while ((responseLine = br.readLine()) != null) {
					// response.append(responseLine.trim());
					response.append(responseLine);
				}
				jsonStr = response.toString();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return jsonStr;
	}

	@RequestMapping(value = "/selectPromptSample.do", method = RequestMethod.POST)
	@ResponseBody
	public List<PromptBaseDTO> selectPromptSample() {

		List<PromptBaseDTO> promptBaseDTOList = playgroundService.getAllPromptBase();

		log.debug("selectPromptSample: " + promptBaseDTOList);

		return promptBaseDTOList;
	}

}
