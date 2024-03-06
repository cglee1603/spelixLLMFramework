package com.spelix.domain;

import java.sql.Timestamp;

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
	private String promptRateHistId;
	private String model;
	private String[] llmCustomIds;
	private String promptType;
	private String prompt;
	private String body;
	private String expectResult;
	private String result;
	private String cortYn;
	private String parmJson;
	private String constUser;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}
