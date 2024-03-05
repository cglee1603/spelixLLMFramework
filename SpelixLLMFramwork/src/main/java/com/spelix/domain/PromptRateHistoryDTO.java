package com.spelix.domain;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PromptRateHistoryDTO {

	private String promptRateHistId;
	private String promptId;
	private String promptVer;
	private String[] llmCustomIds;
	private String prompt;
	private String[] sysPromptIds;
	private String sysPromptEtc;
	private String parmJson;
	private double promptRate;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}
