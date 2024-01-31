package com.spelix.domain;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PromptSystemDTO {

	private String systemPromptId;
	private String systemPromptVer;
	private String systemPromptName;
	private String systemPrompt;
	private String constUser;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}
