

/* 
 * 모델 선택 
 */
$(document).ready(function () {
    var $modelList = $('.selectmodel');

    // AJAX 요청으로 데이터를 불러오는 함수
    function loadPromptModelList() {
        $.ajax({
            type: "POST",
            url: "getAllPromptModelList.do",
            success: function (data) {
                // 데이터를 <option> 태그로 변환하고 select 요소에 추가
                data.forEach(function (item) {
                    var option = new Option(item, item);
                    $modelList.append($(option));
                });

                // Select2 적용
                $modelList.select2({
                    placeholder: '모델을 선택해 주세요'
                });
            },
            error: function (error) {
                alert("모델을 가져오는 데 실패했습니다.");
            }
        });

    }

    
    // 데이터 로드 및 Select2 초기화
    loadPromptModelList();

});



/*
 * 모델 선택 후 파라미터 동적 생성
 */
$('.selectmodel').on('select2:select', function (e) {
    var selectedModel = e.params.data.text; // 사용자가 선택한 옵션의 텍스트 값
    var paramJson;    
    var paramJsonKeys;

    $.ajax({
        type: "POST",
        data: { selectedModel: selectedModel },
        url: "getModelParamJsonStr.do",
        success: function (data) {
            paramJson = JSON.parse(data);
            
            // 기존 param 요소들을 제거 (새로운 모델의 파라미터로 대체)
            var paramContainer = document.querySelector('.paramall');
            paramContainer.innerHTML = '';

            for (var key in paramJson) {
                var valueJson = paramJson[key];
                var newParamDiv = document.createElement('div');
                newParamDiv.classList.add('param');
                newParamDiv.innerHTML = `
                    <div class="param-1">
                        <div class="paramtitle">${key}</div>
                        <div class="prograss">
                            <input type="range" class="parambar" id="parambar" value="${valueJson.value}"
                                min="${valueJson.min}" max="${valueJson.max}">
                            <input type="text" class="paramInput" id="paramInput" value="${valueJson.value}">
                        </div>
                    </div>`;
                paramContainer.appendChild(newParamDiv);
                
                var progressBar = newParamDiv.querySelector('.parambar');
                let textInput = newParamDiv.querySelector('.paramInput');
                console.log(textInput);
                progressBar.addEventListener('input', function() {
                    textInput.value = this.value;
                });
            }       
        },
        error: function (error) {
            alert("모델 파라미터를 가져오는 데 실패했습니다.");
        }
    });
});



// 불러오기 팝업 창 열기 및 닫기 스크립트
 var importpopup = document.getElementById("import-prompt-popup");
 var importprompt = document.querySelector(".import-prompt");
 var closeButton = document.getElementsByClassName("import-close-button")[0];

// 프롬프트 샘플 팝업 열기
 importprompt.onclick = function() {
 importpopup.style.display = "block"; 

 }
// 프롬프트 샘플 팝업 닫기
 closeButton.onclick = function() {
 importpopup.style.display = "none";
 }
// FIXME 무슨 기능?
 window.onclick = function(event) {
 if (event.target == importpopup) {
 importpopup.style.display = "none";
 }
 }


// 프롬프트 샘플 팝업 창 열기 및 닫기 스크립트
 var popup = document.getElementById("prompt-sample-popup");
 var promptSample = document.querySelector(".prompt-sample");
 var closeButton = document.getElementsByClassName("close-button")[0];

// 프롬프트 샘플 팝업 열기
 promptSample.onclick = function() {
 popup.style.display = "block"; 
 $.ajax({
	 type: "POST",
	 url: "selectPromptSample.do",
	 success: function(data){
		  $(".base-prompt-all").empty(); // 이전 데이터를 비웁니다.
            $.each(data, function(index, value){
                // 각 프롬프트 샘플에 대한 요소를 생성합니다.
                var promptSampleDiv = $('<div class="base-prompt-sample"></div>');
                promptSampleDiv.append('<div class="base-prompt-title">' + value.basePromptName + '</div>');
                promptSampleDiv.append('<div class="base-prompt-desc">' + value.basePromptDesc + '</div>');

                // 생성된 요소를 base-prompt-all 클래스를 가진 요소에 추가합니다.
                $(".base-prompt-all").append(promptSampleDiv);
         // 클릭 이벤트 핸들러를 추가합니다.
                promptSampleDiv.click(function() {
                    // chat-input 필드에 프롬프트 설명을 삽입합니다.
                    $('#chat-input').val(value.basePromptDesc);
                    // 팝업을 닫습니다.
                    popup.style.display = "none";
                });
            });
        },
	 error: function(error){
		 alert("프롬프트 샘플을 가져오는 데 실패했습니다.")
 }
 }) 
 }
// 프롬프트 샘플 팝업 닫기
 closeButton.onclick = function() {
 popup.style.display = "none";
 }
// FIXME 무슨 기능?
 window.onclick = function(event) {
 if (event.target == popup) {
 popup.style.display = "none";
 }
 }

 
// 시스템 프롬프트 선택
$(document).ready(function () {
    var $promptList = $('.promptlist');

    // AJAX 요청으로 데이터를 불러오는 함수
    function loadPromptData() {
        $.ajax({
            type: "POST",
            url: "getPromptSystemNameList.do",
            success: function (data) {
                // 데이터를 <option> 태그로 변환하고 select 요소에 추가
                data.forEach(function (item) {
                    var option = new Option(item, item);
                    $promptList.append($(option));
                });

                // Select2 적용
                $promptList.select2({
                    placeholder: '프롬프트를 선택해 주세요',
                    multiple: true
                });
            },
            error: function (error) {
                alert("시스템 프롬프트를 가져오는 데 실패했습니다.");
            }
        });
    }


    // 데이터 로드 및 Select2 초기화
    loadPromptData();
});

 
  /*
	 * modal 부분
	 */
 
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("variableModal");
    var btn = document.querySelector(".variableltitle");
    var closeBtn = document.querySelector(".modal-close");
    var addBtn = document.getElementById("addVariableButton");

    btn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    addBtn.onclick = function() {
        var input = document.getElementById("variableInput").value;
        if (!input.trim()) {
            alert("텍스트를 입력하세요.");
            return;
        }

        var container = document.getElementById("variablesContainer");
        var newVariable = document.createElement("div");
        newVariable.classList.add("variableItem");
        newVariable.textContent = input;

        var deleteBtn = document.createElement("span");
        deleteBtn.textContent = "x";
        deleteBtn.classList.add("deleteButton");
        deleteBtn.onclick = function() {
            container.removeChild(newVariable);
        };

        newVariable.appendChild(deleteBtn);
        container.appendChild(newVariable);

        modal.style.display = "none";
        document.getElementById("variableInput").value = ""; // 입력 필드 초기화
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});




/*
 * Chatbot 응답 주는 function ajax로 처리.
 */
const getChatResponse = async (incomingChatDiv) => {
	const pElement = document.createElement("p");
// document.getElementById("metaData").textContent = "";
	var searchObj = {
		"sp_body": userText,
		"sp_previous_message": tempChatbotAnswer
	};
	console.log(searchObj);
	if (localStorage.getItem(JSON.stringify(searchObj)) != null) {
		console.log("temp data");
		var tempRtnData = JSON.parse(localStorage.getItem(JSON.stringify(searchObj)));
		setTimeout(function() {
			setResultVal(tempRtnData, pElement);
			chatTypeingEnd(incomingChatDiv, pElement);
		}, 1000);
	}
	else {
		$.ajax({
			type: "POST",
			url: "getLLMChatbot.do",  // 요청을 보낼 URL
			data: searchObj,          // 요청 데이터
			async: true,             // 요청을 동기적으로 보내기 위해 async 옵션을 false로 설정
			success: function(rtnData, status) {
				// 성공적으로 요청을 완료한 경우

				localStorage.setItem(JSON.stringify(searchObj), JSON.stringify(rtnData));
				setResultVal(rtnData, pElement);
				chatTypeingEnd(incomingChatDiv, pElement);
			},
			error: function(xhr, status, error) {
				// 요청 중에 에러가 발생한 경우
				pElement.classList.add("error");
				pElement.textContent = "죄송합니다. 답변을 드릴 수 없습니다. 잠시후 다시 시도해 주세요.";

				chatTypeingEnd(incomingChatDiv, pElement);
			}
		});
	}
}

function typeWriter(element, text, i = 0) {
  if (i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
    setTimeout(() => typeWriter(element, text, i), 100);
  } else {
    // 타이핑이 끝난 후 커서를 숨김
    element.style.borderRight = "none";
  }
}

const resultText = document.querySelector('.result-text');
const textToType = "결과값 결과값 결과값"; // 여기에 타이핑할 텍스트를 입력하세요

typeWriter(resultText, textToType);


loadDataFromLocalstorage();


