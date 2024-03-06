package com.spelix.domain;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PromptMasterDTO {

	private String promptId;
	private String promptVer;
	private String model;
	private String promptName;
	private String promptDesc;
	private String promptType;
	private String[] llmCustomIds;
	private String prompt;
	private String promptTestId;
	private float promptRate;
	private String basePromptId;
	private String[] sysPromptIds;
	private String sysPromptEtc;
	private String constUser;
	private String useYN;
	private String parmJson;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}
