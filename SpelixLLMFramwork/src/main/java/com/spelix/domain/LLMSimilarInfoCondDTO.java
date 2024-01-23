package com.spelix.domain;

import java.util.List;

public class LLMSimilarInfoCondDTO {

	private String sp_model;
	private String sp_category;
	private String sp_type;
	private List<String> sp_type_summarize;
	private List<String> sp_file_name;
	private String sp_body;
	private String customPrompt;
	private String postName;
	private String sp_previous_message;

	private String sp_max_length = "1024";
	private String sp_max_token = "1024";
	private String sp_temperature = "0.01";
	private String sp_top_p = "0.95";
	private String sp_top_k = "100";

	private Integer SIZE;
	private Integer PAGE; // 현재페이지번호
	private Integer COUNTLIST; // 한 페이지에 출력될 게시물 수 (
	private Integer BEGIN;
	private Integer TOTALDATA;

	public String getPostName() {
		return postName;
	}

	public void setPostName(String postName) {
		this.postName = postName;
	}

	public List<String> getSp_file_name() {
		return sp_file_name;
	}

	public void setSp_file_name(List<String> sp_file_name) {
		this.sp_file_name = sp_file_name;
	}

	public String getSp_previous_message() {
		return sp_previous_message;
	}

	public void setSp_previous_message(String sp_previous_message) {
		this.sp_previous_message = sp_previous_message;
	}

	public String getCustomPrompt() {
		return customPrompt;
	}

	public void setCustomPrompt(String customPrompt) {
		this.customPrompt = customPrompt;
	}

	public String getSp_body() {
		return sp_body;
	}

	public void setSp_body(String sp_body) {
		this.sp_body = sp_body;
	}

	public Integer getSIZE() {
		return SIZE;
	}

	public void setSIZE(Integer sIZE) {
		SIZE = sIZE;
	}

	public Integer getPAGE() {
		return PAGE;
	}

	public void setPAGE(Integer pAGE) {
		PAGE = pAGE;
	}

	public Integer getCOUNTLIST() {
		return COUNTLIST;
	}

	public void setCOUNTLIST(Integer cOUNTLIST) {
		COUNTLIST = cOUNTLIST;
	}

	public Integer getBEGIN() {
		return BEGIN;
	}

	public void setBEGIN(Integer bEGIN) {
		BEGIN = bEGIN;
	}

	public Integer getTOTALDATA() {
		return TOTALDATA;
	}

	public void setTOTALDATA(Integer tOTALDATA) {
		TOTALDATA = tOTALDATA;
	}

	public String getSp_model() {
		return sp_model;
	}

	public void setSp_model(String sp_model) {
		this.sp_model = sp_model;
	}

	public String getSp_category() {
		return sp_category;
	}

	public void setSp_category(String sp_category) {
		this.sp_category = sp_category;
	}

	public String getSp_type() {
		return sp_type;
	}

	public void setSp_type(String sp_type) {
		this.sp_type = sp_type;
	}

	public List<String> getSp_type_summarize() {
		return sp_type_summarize;
	}

	public void setSp_type_summarize(List<String> sp_type_summarize) {
		this.sp_type_summarize = sp_type_summarize;
	}

	public String getSp_max_length() {
		return sp_max_length;
	}

	public void setSp_max_length(String sp_max_length) {
		this.sp_max_length = sp_max_length;
	}

	public String getSp_max_token() {
		return sp_max_token;
	}

	public void setSp_max_token(String sp_max_token) {
		this.sp_max_token = sp_max_token;
	}

	public String getSp_temperature() {
		return sp_temperature;
	}

	public void setSp_temperature(String sp_temperature) {
		this.sp_temperature = sp_temperature;
	}

	public String getSp_top_p() {
		return sp_top_p;
	}

	public void setSp_top_p(String sp_top_p) {
		this.sp_top_p = sp_top_p;
	}

	public String getSp_top_k() {
		return sp_top_k;
	}

	public void setSp_top_k(String sp_top_k) {
		this.sp_top_k = sp_top_k;
	}

}
