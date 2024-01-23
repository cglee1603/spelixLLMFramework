package com.spelix.domain;

import java.sql.Timestamp;

public class PromptTestData {

    private String promptId;
    private String promptVersion;
    private int numericValue;
    private String body;
    private String correctAnswer;
    private String insertUser;
    private Timestamp insertDate;
    private String updateUser;
    private Timestamp updateDate;
	public String getPromptId() {
		return promptId;
	}
	public void setPromptId(String promptId) {
		this.promptId = promptId;
	}
	public String getPromptVersion() {
		return promptVersion;
	}
	public void setPromptVersion(String promptVersion) {
		this.promptVersion = promptVersion;
	}
	public int getNumericValue() {
		return numericValue;
	}
	public void setNumericValue(int numericValue) {
		this.numericValue = numericValue;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getCorrectAnswer() {
		return correctAnswer;
	}
	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}
	public String getInsertUser() {
		return insertUser;
	}
	public void setInsertUser(String insertUser) {
		this.insertUser = insertUser;
	}
	public Timestamp getInsertDate() {
		return insertDate;
	}
	public void setInsertDate(Timestamp insertDate) {
		this.insertDate = insertDate;
	}
	public String getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	public Timestamp getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Timestamp updateDate) {
		this.updateDate = updateDate;
	}
	@Override
	public String toString() {
		return "PromptTestData [promptId=" + promptId + ", promptVersion=" + promptVersion + ", numericValue="
				+ numericValue + ", body=" + body + ", correctAnswer=" + correctAnswer + ", insertUser=" + insertUser
				+ ", insertDate=" + insertDate + ", updateUser=" + updateUser + ", updateDate=" + updateDate + "]";
	}
}