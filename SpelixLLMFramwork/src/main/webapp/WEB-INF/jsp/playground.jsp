<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Azure AI Studio Interface</title>


<link
	href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
	rel="stylesheet" />
<link href="http://www.jqueryscript.net/css/jquerysctipttop.css"
	rel="stylesheet" type="text/css">
<link rel="stylesheet"
	href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link
	href="<%=application.getContextPath()%>/resources/css/bootstrap.min.css"
	rel="stylesheet">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/global.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/styleguide.css">
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
						<select class="selectmodel" id="selectmodel">
							<option value="">모델을 선택해 주세요</option>
						</select>

						<!--　상단　메뉴　-->
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/save.svg"
								class="settingicon">
							<div class="titlelabel">
								<span id="save-prompt-master">저장하기</span>
							</div>
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
									<table class="js-dynamitable table table-bordered"
										id="inputtable">
										<!-- table heading -->
										<thead>
											<tr>
												<th class="thheader"></th>
												<th class="thheader promptId" data-field="promptId"><label
													class="tablelabel">ID</label></th>
												<th class="thheader promptVer" data-field="promptVer"><label
													class="tablelabel" id="thheader">Version</label></th>
												<th class="thheader model" data-field="model"><label
													class="tablelabel">모델</label></th>
												<th class="thheader promptName" data-field="promptName"><label
													class="tablelabel">Name</label></th>
												<th class="thheader promptDesc" data-field="promptDesc"><label
													class="tablelabel">Desc</label></th>
												<th class="thheader promptType" data-field="promptType"><label
													class="tablelabel">Type</label></th>
												<th class="thheader llmCustomIds" data-field="llmCustomIds"><label
													class="tablelabel">LLM ID</label></th>
												<th class="thheader prompt" data-field="prompt"><label
													class="tablelabel">Prompt</label></th>
												<th class="thheader promptRate" data-field="promptRate"><label
													class="tablelabel">정답률</label></th>
												<th class="thheader basePromptId" data-field="basePromptId"><label
													class="tablelabel">베이스 프롬프트 ID</label></th>
												<th class="thheader sysPromptIds" data-field="sysPromptIds"><label
													class="tablelabel">시스템 프롬프트 ID</label></th>
												<th class="thheader sysPromptEtc" data-field="sysPromptEtc"><label
													class="tablelabel">지정되지 않은 시스템 프롬프트</label></th>
												<th class="thheader constUser" data-field="constUser"><label
													class="tablelabel">작성자</label></th>
												<th class="thheader useYN" data-field="useYN"><label
													class="tablelabel">사용여부</label></th>
												<th class="thheader parmJson" data-field="parmJson"><label
													class="tablelabel">파라미터</label></th>
												<th class="thheader insertUser" data-field="insertUser"><label
													class="tablelabel">입력자</label></th>
												<th class="thheader insertDate" data-field="insertDate"><label
													class="tablelabel">입력일</label></th>
												<th class="thheader updateUser" data-field="updateUser"><label
													class="tablelabel">수정자</label></th>
												<th class="thheader updateDate" data-field="updateDate"><label
													class="tablelabel">수정일</label></th>
											</tr>
											<tr>
												<th></th>
												<th></th>
												<th></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th></th>
												<th></th>
												<th></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th></th>
												<th><input class="js-filter  form-control" type="text"
									value=""></th>
												<th></th>
												<th></th>
												<th></th>
												<th></th>
												<th></th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</div>
								<div class="import-button">
									<button type="button">확인</button>
								</div>
								<div class="pagination-wrapper">
									<ul class="pagination">
										<!-- 페이지네이션 링크가 여기에 동적으로 생성됩니다 -->
									</ul>
								</div>
							</div>
						</div>
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/export.svg"
								class="settingicon">
							<div class="titlelabel">
								<span id="export-file">내보내기</span>
							</div>
						</div>
						<div class="settingmenu">
							<img
								src="<%=application.getContextPath()%>/resources/img/import.svg"
								class="settingicon">
							<div class="titlelabel">
								<input type="file" id="import-file" name="file"
									style="display: none;" /> <label for="import-file"
									id="import-label">가져오기</label>
							</div>
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

							<option value="playgroundchat" selected>채팅</option>
							<option value="playgroundprompt">프롬프트</option>
						</select>
					</div>
				</div>

			</div>

			<div class="maincontents" id="maincontents"></div>
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
