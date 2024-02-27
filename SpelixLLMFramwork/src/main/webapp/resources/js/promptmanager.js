$.ajax({
	type : "GET",
	url : "/promptmanager/getAllPromptMaster.do",
	success : function(data) {
		$.each(data, function(index, value) {
			console.log(data);
		});
	},
	error : function() {
		alert("프롬프트 마스터를 가져오는 데 실패했습니다.");
	}
});

