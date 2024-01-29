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
	private String promptDesc;
	private String promptType;
	// FIXME 데이터 타입 확인 필요
	private Object llmCustomIds;
	private String prompt;
	private float promptRate;
	private String basePrompId;
	private Object sysPromptIds;
	private String constUser;
	private String useYN;
	private String parmJson;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}
