<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Azure AI Studio Interface</title>

<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/global.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/styleguide.css">
<link
	href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />
<link href="http://www.jqueryscript.net/css/jquerysctipttop.css"
	rel="stylesheet" type="text/css">
<link rel="stylesheet"
	href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link
	href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"
	rel="stylesheet">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/playgroundprompt.css">

</head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<body>


	<div class="promptmaincontents">

		<!--　프롬프트 사용자 입력　-->
		<div class="setting">
			<div class="maintitle">프롬프트</div>
			<div class="systemprompt">
				<div class="subtitle">시스템 프롬프트 선택</div>
				<div class="promptlist">
					<select class="form-control" id="promptlist" multiple="multiple">
					</select>
				</div>

				<div class="prompttext">
					<div class="subtitle">시스템 프롬프트 입력</div>
					<textarea
						placeholder="You are an AI assistant that helps people find information."
						id="sysprompttextarea"></textarea>
				</div>
			</div>
			<div class="customprompt">
				<div class="subtitle">프롬프트 입력</div>
				<div class="customprompttext">
					<textarea
						placeholder="GPT는 {역할}로서, 다음과 같은 역할을 합니다:

1. 조건 입력
2. 조건 입력
3. 조건 입력

답변 시에는 다른 고려 요소들에 대한 설명은 생략하세요.
각 역할을 수행할 때는, 반드시 사용자의 관련 요청이 있을 때만 수행하세요."
						id="promptarea"></textarea>
					<div class="import-button-container">
						<button type="button" id="prompt-input-button"
							class="prompt-input-button">입력</button>
					</div>
				</div>
			</div>

			<!--　변수 추가　-->
			<div class="variable">
				<div class="line-with-text">
					<hr class="line" />
					<div class="subtitle">변수</div>
					<hr class="line" />
				</div>

				<div class="addvariable">
					<div class="variableltitle">{x} 변수 추가</div>
				</div>

				<div id="variablesContainer"></div>
				<!-- 여기에 변수가 표시됩니다 -->
			</div>

			<!-- 모달 구조 -->
			<div id="variableModal" class="modal">
				<div class="modal-content">
					<span class="modal-close">&times;</span>
					<!-- 닫기 버튼 -->
					<div class="subtitle">변수 입력</div>
					<input type="text" id="variableInput" class="variableInput"
						placeholder="변수를 입력하세요">
					<button id="addVariableButton" class="addVariableButton">완료</button>
					<!-- 입력 버튼 추가 -->
				</div>
			</div>
		</div>

		<!-- 프롬프트 결과　-->
		<div class="prompt-result">
			<div class="result-container">
				<span class="result-text"></span>
			</div>

		</div>

		<!-- 파라미터　값　설정　-->
		<div class="parameter">
			<div class="maintitle">Parameters</div>
			<div class="paramall">
				<div class="param"></div>
			</div>
		</div>

	</div>


	<!-- jQuery -->
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<!-- select2 javascript cdn -->
	<script
		src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
	<script type="text/javascript"
		src="<%=application.getContextPath()%>/resources/js/table/dynamitable.jquery.min.js"></script>
	<script
		src="<%=application.getContextPath()%>/resources/js/playgroundprompt.js"></script>


</body>

</html>
