package com.spelix.domain;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PromptTestDataDTO {

	private String promptTestId;
	private String promptTestName;
	private int num;
	private String body;
	private String answer;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}