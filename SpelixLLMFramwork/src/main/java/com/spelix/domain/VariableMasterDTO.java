package com.spelix.domain;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class VariableMasterDTO {

	private String variableId;
	private String variableName;
	private String variableDesc;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;

}
