package com.spelix.domain;

import java.sql.Timestamp;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ParameterMasterDTO {

	private String parameterId;
	private String parameterName;
	private String valueType;
	private int minValue;
	private int maxValue;
	private int valueOffset;
	private String defaultValue;
	private String insertUser;
	private Timestamp insertDate;
	private String updateUser;
	private Timestamp updateDate;
}
