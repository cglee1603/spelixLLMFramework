
var paramJson = null; // 전역 변수로 paramJson을 선언 import 할때만 써야하기 때문
var selectedModelId;
var modelMasterJsonById = {};
var currentParamValueJson = {};
var promptBaseId;
var promptType;


/*
 * 모델 선택
 */
$(document).ready(function () {
    var $modelSelect = $('#selectmodel');

    function loadPromptModelList() {
        $.ajax({
            type: "POST",
            url: "getAllPromptModelList.do",
            success: function (data) {
                $.each(data, function(index, value){
                    var option = new Option(value.modelName, value.modelId);
                    $modelSelect.append(option);
                    
                    modelMasterJsonById[value.modelId] = value; 
                });
            },
            error: function (error) {
                alert("모델을 가져오는 데 실패했습니다.");
            }
        });
    }
    
    loadPromptModelList();
});

$('#selectmodel').on('change', function() {
	selectedModelId = $("#selectmodel").val();
    loadModelParameters();
});



/*
 * 모드 선택
 */
$(document).ready(function() {
    loadContent('playgroundchat');
    // 모드 변경 시 콘텐츠 로드
    $('#changemode').on('change', function() {
        var selectedMode = $(this).val();
        
        loadContent(selectedMode);
    });

});




/*
 * 불러오기 팝업
 */

var importPopup = document.getElementById("import-prompt-popup");
var importCloseButton = document.getElementsByClassName("import-close-button")[0];

/* 불러오기 테이블 */

$(document).ready(function() {
    // 불러오기 버튼 클릭 이벤트
    $(".import-prompt").click(function() {
        // 팝업 창 표시 (선택적)
        $("#import-prompt-popup").show();
        
        $(".import-popup-content").scroll(function() {
            // 가로 스크롤 위치에 따라 닫기 버튼의 위치를 조정합니다.
            var scrollPosition = $(".import-popup-content").scrollLeft();
            var containerWidth = $(".import-popup-content").outerWidth();
            var buttonWidth = $(".import-close-button").outerWidth();
            
            // 닫기 버튼의 새로운 right 위치를 계산합니다.
            var newRightPosition = containerWidth - buttonWidth - scrollPosition - 10; // 10px는
																						// 초기
																						// 오른쪽
																						// 여백입니다.
            $(".import-close-button").css('left', newRightPosition + 'px');
        });

        // AJAX 요청 실행
        $.ajax({
        	type: 'POST',
            url: 'getPromptMaster.do',            
            success: function(data) {
                var pageSize = 10; // 페이지 당 행의 수
                var pageCount = Math.ceil(data.length / pageSize); // 총 페이지 수
                var currentPage = 1;


                // 페이지네이션 초기화
                $(".pagination").empty();

                // 페이지 번호 생성
                for(var i = 1 ; i <= pageCount; i++){
                    $(".pagination").append('<li><a href="#">' + i + '</a></li>');
                }

                // 첫 페이지 로드
                displayPage(currentPage, data, pageSize);

                // 페이지 번호 클릭 이벤트
                $('.pagination').on('click', 'li', function() {
                    currentPage = $(this).index() + 1;
                    displayPage(currentPage, data, pageSize);
                });

                // 페이지에 데이터 표시
                function displayPage(page, data, pageSize) {
                    var start = (page - 1) * pageSize;
                    var end = start + pageSize;

                    $("#inputtable tbody").empty();

                    // 모든 헤더 요소를 포함하는 headers 배열
                    var headers = $("#inputtable thead th.thheader").map(function() {
                        return { field: $(this).data('field'), class: $(this).attr('class') };
                    }).get();
                    
                    console.log("length: " +data.length)

                    for (var i = start; i < end && i < data.length; i++) {
                        var row = $('<tr/>');
                        
                        console.log("headers length: " +headers.length)
                        // 모든 headers에 대한 td 생성
                        headers.forEach(function(header, index) {
                        	
                            var cell;
                            if (index === 0) {
                                // 첫 번째 td (라디오 버튼) 추가
                                cell = $('<td/>').html('<input type="radio" name="selection" value="' + i + '" />');
                            } else if (header.field === 'parmJson') {
                                var formattedData = '';
                                try {
                                    var jsonData = JSON.parse(data[i][header.field]);
                                    $("input[name='hidden_parmJson']").val(JSON.stringify(jsonData));

                                    Object.keys(jsonData).forEach(function(key) {
                                        var param = jsonData[key];
                                        formattedData += param.parameterName + ': ' + param.defaultValue + '<br>';
                                    });
                                } catch (e) {
                                    formattedData = 'Invalid JSON';
                                }
                                cell = $('<td/>').addClass(header.class).html(formattedData);
                            } else {
                                cell = $('<td/>').addClass(header.class).text(data[i][header.field] || '');
                            }
                            row.append(cell);
                        });

                        $("#inputtable tbody").append(row);
                    }
                }

            },
            error: function(xhr, status, error) {
            	console.log(xhr.responseText); 
            	}
        });
    });
    
 // 프롬프트 샘플 팝업 닫기
    importCloseButton.addEventListener("click", function() {
    	importPopup.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == importPopup) {
        	importPopup.style.display = "none";
        }
    });
});



/*
 * 불러오기 - 적용 대상 선택 시 동작
 */
$(".import-button button").click(function() {
    var selectedRow = $('input[type="radio"][name="selection"]:checked').closest('tr');

    if (selectedRow.length > 0) {
        var modelValue = selectedRow.find("td.model").text();
        var promptTypeValue = selectedRow.find("td.promptType").text().trim();
        var sysPromptIdsValue = selectedRow.find("td.sysPromptIds").text().trim();
        var sysPromptEtcValue = selectedRow.find("td.sysPromptEtc").text();
        var importparamJson = selectedRow.find("td.parmJson").text().trim();
        var promptValue = selectedRow.find("td.prompt").text();
        
        if (promptTypeValue === '프롬프트') {
            $("#changemode").val("playgroundprompt");
        } else if (promptTypeValue === '채팅') {
            $("#changemode").val("playgroundchat");
        }
        

        if ($("#selectmodel").val() === null) {
            $("#selectmodel").val("");
        }
        if ($("#changemode").val() === null) {
            $("#changemode").val("playgroundchat");
        }

        // 모달 창 숨김과 동시에 변경된 모드와 모델에 대한 로드 함수 호출

        $("#import-prompt-popup").hide(function() {
        	updatePromptList(sysPromptIdsValue);

        	// 지정되지 않은 시스템 프롬프트 textarea에 반영
            if (sysPromptEtcValue) {
                $("#sysprompttextarea").val(sysPromptEtcValue);
            }
            
         // 프롬프트 textarea에 반영
            if (promptValue) {
                $("#promptarea").val(promptValue);
            }
            
            findModelIdByName(modelValue);
            $("#selectmodel").val(selectedModelId);
            
            // loadContent의 AJAX 요청이 완료된 후 loadModelParameters 호출
            paramJson = JSON.parse($('input[name="hidden_parmJson"]').val());// 전역변수에 할당
        	loadModelParameters();
        });
    } else {
        alert("라디오 버튼을 선택해주세요.");
    }
});


function findModelIdByName(name) {
    var modelKey = Object.keys(modelMasterJsonById).find(key => {
        var model = modelMasterJsonById[key];
        return model.modelName === name;
    });

    selectedModelId = modelKey;
}


//sysPromptIds 문자열을 파싱하여 #promptlist에 옵션으로 추가하는 함수
function updatePromptList(sysPromptIdsValue) {

	var selectedValues = [];
	
	if (sysPromptIdsValue) {
		var sysPromptIdsArray = sysPromptIdsValue.replace(/"/g, '').split(',');
		
		sysPromptIdsArray.forEach(function(id) {
			selectedValues.push(id);
		});
	}

	console.log("selectedValues: ", selectedValues);
	$promptList.val(selectedValues).trigger('change');
	$promptList.select2();

}

/* 모델 선택 후 파라미터 로드 하는 fuction - FIX_DS */
function loadModelParameters() {
	
	// globalParamJson의 존재 여부를 확인합니다.
    if (typeof paramJson === 'undefined') {
    	paramJson = {}; // globalParamJson이 없으면 빈 객체로 초기화합니다.
    }
    
    var paramContainer = $('.paramall').get(0); // jQuery 객체에서 순수 DOM 객체로 변환

    if (paramContainer) {
        paramContainer.innerHTML = '';
        currentParamValueJson = {};

        $.ajax({
            type: "POST",
            data: { selectedModelTypeName: modelMasterJsonById[selectedModelId].modelType },
            url: "getParamMasterByParamId.do",
            success: function (data) {
                // DOM이 완전히 업데이트되었는지 확인
                setTimeout(function() {
                	$.each(data, function(index, value) {
                        // json 객체 복사
                        var paramValue = Object.assign({}, value);

                        // globalParamJson 값을 확인하고 조건에 따라 처리
                        if (paramJson && paramJson.hasOwnProperty(value.parameterName)) {
                            paramValue.defaultValue = paramJson[value.parameterName];
                        }
                    	
                        createParam(paramContainer, value);
                    });
                }, 0);
            },
            error: function () {
                alert("모델 파라미터를 가져오는 데 실패했습니다.");
            }
        });
    }
}

function createParam(paramContainer, json, index) {
    var newParamDiv = document.createElement('div');
    newParamDiv.classList.add('param');
    newParamDiv.innerHTML = `
        <div class="param-1">
            <div class="paramtitle">${json.parameterName}</div>
            <div class="prograss-param">
                <input type="range" class="parambar" id="parambar" value="${json.defaultValue}"
                    min="${json.minValue}" max="${json.maxValue}" step="${json.valueOffset}">
                <input type="text" class="paramInput" id="paramInput" value="${json.defaultValue}">
            </div>
        </div>`;
    paramContainer.appendChild(newParamDiv);

    var progressBar = newParamDiv.querySelector('.parambar');
    var textInput = newParamDiv.querySelector('.paramInput');

    var tempJson = {};
    tempJson.minValue = json.minValue;
    tempJson.maxValue = json.maxValue;
    tempJson.defaultValue = textInput.value;
    tempJson.parameterName = json.parameterName;
    
    currentParamValueJson[json.parameterName] = tempJson;

    progressBar.addEventListener('input', function() {
        textInput.value = this.value;
        tempJson.defaultValue = textInput.value;
        currentParamValueJson[json.parameterName] = tempJson;
    });

    // 텍스트 입력에 대한 이벤트 리스너 추가
    textInput.addEventListener('input', function() {
        var inputValue = this.value.trim();

        // 입력값이 빈 문자열인 경우 아무것도 하지 않음
        if (inputValue === '') {
            return;
        }

        inputValue = parseFloat(inputValue);
        if (!isNaN(inputValue) && inputValue >= json.minValue && inputValue <= json.maxValue) {
            progressBar.value = inputValue;
            tempJson.defaultValue = inputValue;
            currentParamValueJson[json.parameterName] = tempJson;
        } else {
            alert(`${json.parameterName}의 값은 ${json.minValue}와 ${json.maxValue} 사이여야 합니다.`);
            this.value = tempJson.defaultValue;
        }
    });
}


// TODO 변수들 초기화
function loadContent(mode, callback) {
	promptType = $("#changemode option:selected").text();
	var noCache = new Date().getTime(); // 현재 시간을 타임스탬프로 사용
    var url = '/SpelixLLMFramework/' + mode + '?t=' + noCache; // URL에 타임스탬프 추가
	
    $.ajax({
        url: url, // 예:
											// /SpelixLLMFramework/playgroundchat
											// 또는
											// /SpelixLLMFramework/playgroundprompt
        type: 'GET',
        success: function(response) {
        	
            // 서버로부터 받은 HTML 컨텐츠를 maincontents 영역에 삽입
            $('#maincontents').html(response);
            

            // 추가된 콜백 함수 실행
            if (typeof callback === 'function') {
                callback();
            }
        },
        error: function(error) {
        	
            console.log(error);
        }
    });
}



/*
 * 프롬프트 샘플
 */
var promptSamplePopup = document.getElementById("prompt-sample-popup");
var promptSampleCloseButton = document.getElementsByClassName("close-button")[0];

// 프롬프트 샘플 팝업 열기
document.querySelector(".prompt-sample").addEventListener("click", function() {
    if (typeof selectedModelId === 'undefined') {
        alert("프롬프트 샘플 가져오기 실패. 모델을 선택해 주세요.");
        return;
    }

    promptSamplePopup.style.display = "block";

    $.ajax({
        type: "POST",
        url: "selectPromptSample.do",
        success: function(data) {
            var basePromptAll = $(".base-prompt-all").empty();
            data.forEach(function(value) {
                var promptSampleDiv = $('<div class="base-prompt-sample"></div>');
                promptSampleDiv.append('<div class="base-prompt-title">' + value.basePromptName + '</div>');
                promptSampleDiv.append('<div class="base-prompt-desc">' + value.basePromptDesc + '</div>');
                promptSampleDiv.on("click", function() {
                    $('#chat-input').val(value.basePromptDesc);
                    console.log("promptBaseId: ", value.basePromptId);
                    promptSamplePopup.style.display = "none";
                });
                basePromptAll.append(promptSampleDiv);
            });
        },
        error: function(error) {
            alert("프롬프트 샘플을 가져오는 데 실패했습니다.");
        }
    });
});

// 프롬프트 샘플 팝업 닫기
promptSampleCloseButton.addEventListener("click", function() {
    promptSamplePopup.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == promptSamplePopup) {
        promptSamplePopup.style.display = "none";
    }
});


 
 
/*
 * json 파일 내보내기
 */
document.getElementById('export-file').addEventListener('click', exportToFile);

function exportToFile() {
	
	if (typeof selectedModelId === 'undefined') {
		alert("내보내기 실패. 모델을 선택해 주세요.");
		return;
	}
	
    var fileContent = {};
    fileContent.model = selectedModelId;
	fileContent.parameters = currentParamValueJson;
	fileContent.selectedSystemPromptId = selectedSystemPromptId;
	// fileContent.variables = ;
	
	if (promptType === "프롬프트") {
		fileContent.inputSystemPrompt = document.getElementById('sysprompttextarea').value;
		fileContent.prompt = inputTxt;
	}
	if (promptType === "채팅") {
		fileContent.inputSystemPrompt = promptArea.value;
	}
	

    var blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'setting.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}




/*
 * json 파일 가져오기
 */
document.getElementById('import-file').addEventListener('change', importFromFile);

function importFromFile() {
	 var fileInput = document.getElementById('import-file');
	    var file = fileInput.files[0];

	    if (file) {
	        var reader = new FileReader();
	        reader.readAsText(file);

	        reader.onload = function (e) {
	            var fileContent = e.target.result;

	            try {
	                var jsonData = JSON.parse(fileContent);

	                // model 설정
	                selectedModelId = jsonData.model;
	                $("#selectmodel").val(selectedModelId);

	                // param 설정
	                var paramContainer = document.querySelector('.paramall');
	                paramContainer.innerHTML = '';
	                currentParamValueJson = {};
	                
	                for (var tmp in jsonData.parameters) {
	                	createParam(paramContainer, jsonData.parameters[tmp]);
	                }

	                // system prompt 설정
	                updatePromptList(jsonData.selectedSystemPromptId.join(','));
	                promptArea.value = jsonData.inputSystemPrompt;
	                
	                // prompt 설정
	                if (promptType === "프롬프트"){
		                promptArea.value = jsonData.prompt;
	                	document.getElementById('sysprompttextarea').value = jsonData.inputSystemPrompt;
	                }
	                

	            } catch (error) {
	                console.error('JSON 파싱 오류:', error);
	            }
	        };

	    } else {
	        alert('파일을 가져오는 데 실패했습니다.');
	    }

}



/*
 * 저장하기
 */
document.getElementById('save-prompt-master').addEventListener('click', savePromptMaster);

function savePromptMaster(){

	if (typeof selectedModelId === 'undefined') {
		alert("저장하기 실패. 모델을 선택해 주세요.");
		return;
	}
	
	var promptType = $("#changemode option:selected").text();

	var requestParam = new Object();
	requestParam.promptVer = "0001";
	requestParam.model = modelMasterJsonById[selectedModelId].modelName;
	requestParam.promptName = "test";
	requestParam.basePromptId = promptBaseId;
	requestParam.useYN = "Y";
	requestParam.parmJson = JSON.stringify(currentParamValueJson);
	requestParam.promptType = promptType;
	requestParam.sysPromptIds = selectedSystemPromptId;
	requestParam.sysPromptEtc = promptArea.value;
	
	if (promptType === "프롬프트"){
		requestParam.prompt = inputTxt;
		requestParam.sysPromptEtc = document.getElementById('sysprompttextarea').value;
	}
	
	console.log("저장하기 requestParam: ", requestParam);
	
	$.ajax({
	    type: "POST",
	    data: requestParam,
	    url: "savePromptMaster.do",
	    traditional: true,
	    success: function (data) {
	        alert("저장하기 성공");
	    },
	    error: function (error) {
	        alert("저장하기 실패");
	    }
	});
	
}




/*
 * 변수 초기화
 */
function initializeVariable(){
	
}