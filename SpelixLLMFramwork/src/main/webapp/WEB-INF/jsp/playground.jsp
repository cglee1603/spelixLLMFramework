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
	href="<%=application.getContextPath()%>/resources/css/playground.css">

</head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<body>
	<div class="wrapper">
		<div class="content">
			<div class="contentstable">
				<div class="allsetting">
					<div class="overlap-group">

						<!--　모델　선택　-->
						<div class="model">
							<div class="titlelabel">모델</div>
							<select id="selectmodel" name="selectmodel" class="selectmodel">
								<option disabled selected>적용모델을 선택하세요</option>
								<option value="1">llama</option>
								<option value="2">gpt</option>
							</select>
						</div>

						<!--　상단　메뉴　-->
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/save.svg"
								class="settingicon">
							<div class="titlelabel">저장하기</div>
						</div>
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/import2.svg"
								class="settingicon">
							<div class="titlelabel">
							<span class="import-prompt">불러오기</span>
							</div>
						</div>

						<!-- 팝업 창 -->
						<div id="import-prompt-popup" class="import-prompt-popup">
							<div class="import-popup-content">
								<span class="import-close-button">&times;</span>
								<h2>불러오기 리스트</h2>
								<div class=import-prompt-all>
								<table class="js-dynamitable table  table-bordered" id="inputtable">
						<!-- table heading -->
						<thead>
							<tr>
								<th class="check"><input type="checkbox" id="all"
									onclick="toggleAll(this)"></th>
								<th><input type="checkbox" id="part"><label
									class="tablelabel">No</label></th>
								<th><input type="checkbox" id="part"><label
									class="tablelabel">담당부서</label></th>
								<th><input type="checkbox" id="action"><label
									class="tablelabel">장애내용</label></th>
								<th><input type="checkbox" id="error"><label
									class="tablelabel">조치내용</label></th>
							</tr>
							<tr>
								<th class="check">input filter</th>
								<th><input class="js-filter  form-control" type="text"
									value=""></th>
								<th><input class="js-filter  form-control" type="text"
									value=""></th>
								<th><input class="js-filter  form-control" type="text"
									value=""></th>
								<th><input class="js-filter  form-control" type="text"
									value=""></th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
								</div>
							</div>
						</div>
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/export.svg"
								class="settingicon">
							<div class="titlelabel">내보내기</div>
						</div>
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/import.svg"
								class="settingicon">
							<div class="titlelabel">가져오기</div>
						</div>
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/prompt.png"
								class="settingicon">
							<div class="titlelabel">
								<span class="prompt-sample">프롬프트 샘플</span>
							</div>
						</div>
					</div>

					<!-- 팝업 창 -->
					<div id="prompt-sample-popup" class="prompt-sample-popup">
						<div class="popup-content">
							<span class="close-button">&times;</span>
							<h2>프롬프트 샘플 선택</h2>
							<div class=base-prompt-all></div>
						</div>
					</div>
						<!--　모드　선택　-->
					<div class="mode">
					<div class="titlelabel">모드</div>
					<select id="changemode" name="changemode" class="changemode">

						<option value="chat" selected>채팅</option>
						<option value="prompt">프롬프트</option>
					</select>
				</div>
				</div>

			</div>

			<div class="maincontents">

				<!--　시스템　프롬프트　-->
				<div class="setting">
					<div class="maintitle">시스템 프롬프트</div>
					<div class="systemprompt">
						<div class="subtitle">프롬프트 선택</div>
						<div class="promptlist">
							<select class="form-control" id="promptlist" multiple="multiple">
							</select>
						</div>

						<div class="prompttext">
							<div class="subtitle">프롬프트 입력</div>
							<textarea
								placeholder="You are an AI assistant that helps people find information."
								id="promptarea"></textarea>
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

				<!-- 챗봇　-->
				<div class="chatbot">
					<div class="chat-container"></div>
					<div class="chattext">
						<div class="textarea-container">
							<textarea id="chat-input" spellcheck="false"
								placeholder="Enter a prompt here" required></textarea>
							<span id="send-btn" class="material-symbols-rounded"><img
								src="<%=application.getContextPath()%>/resources/img/send.svg"
								class="sendbutton"></span>
						</div>
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
		src="<%=application.getContextPath()%>/resources/js/playground.js"></script>

	
</body>

</html>
