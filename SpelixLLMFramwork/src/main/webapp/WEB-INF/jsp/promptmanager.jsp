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
	href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"
	rel="stylesheet">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/global.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/styleguide.css">
<link rel="stylesheet" type="text/css"
	href="<%=application.getContextPath()%>/resources/css/promptmanager.css">

</head>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<body>
	<div class="wrapper">
		<div class="content">
 <div class="headtitle">
 <span class="promptmanagetitle"><strong>프롬프트 관리</strong></span>
 </div>
     <div class="maincontents">
          <div class="searchprompt">
          <label class="search-model">
          <span class="search-model-title">모델</span>
          <select class="search-model-list">
          <option value="all" disabled selected>전체</option>
          <option value="model1">model-1</option>

          </select>
          </label>
          </div>
          <div class="prompt-area">
          <div class="prompt-delete-area">
          <button type="button" class="prompt-delete-button">선택 삭제</button>
          </div>
          <div class="prompt-table-area">
          <h5>프롬프트 목록</h5>
          <div class="table-responsive">
          <table class="prompt-table">
          <thead>
          <tr>
          <th><div class="prompt-checkbox-area">
          <input type="check" class="prompt-checkbox">
          </div></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
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
          </div>
          </div>
        </div>
		</div>
	</div>


	<!-- jQuery -->
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<!-- select2 javascript cdn -->

	<script
		src="<%=application.getContextPath()%>/resources/js/promptmanager.js"></script>


</body>

</html>
