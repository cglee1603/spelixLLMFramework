package com.spelix.domain;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.json.JSONObject;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PromptResultDTO {

	private String resultId;
	private String promptId;
	private String promptVer;
	private String  model;
	private ArrayList<String> llmCustIds;
	private String promptType;
	private String prompt;
	private String body;
	private String expectResult;
	private String result;
	private String cortYn;
	private String parameterJson;
	private String constUser;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;
	
}
