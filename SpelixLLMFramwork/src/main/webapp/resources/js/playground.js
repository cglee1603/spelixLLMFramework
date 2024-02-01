


//TODO
/* 
 * 내보내기 클릭 시 클립보드에 json으로 복사
 */
//document.getElementById('copyButton').addEventListener('click', function() {
//    // 복사할 텍스트를 여기에 설정
//    var textToCopy = "여기에 복사할 텍스트를 입력하세요";
//
//    // 새로운 textarea 엘리먼트를 동적으로 생성하여 텍스트를 복사
//    var textarea = document.createElement('textarea');
//    textarea.value = textToCopy;
//    document.body.appendChild(textarea);
//    textarea.select();
//    document.execCommand('copy');
//    document.body.removeChild(textarea);
//
//    // 복사 완료 메시지 또는 원하는 동작 추가
//    alert('텍스트가 클립보드에 복사되었습니다.');
//});




/* 
 * 저장하기
 */
$('.save-prompt').on('click', function () {
	
// var model = $("#selectmodel option:checked").text();
	
	console.log("model: "+selectedModel);
	
	var dataObj = {
			
	};
	
	
    $.ajax({
        type: "POST",
        data: dataObj,
        url: "savePrompt.do",
        success: function () {
        	alert("프롬프트 저장을 완료했습니다.");
        },
        error: function (error) {
            alert("프롬프트를 저장하는 데 실패했습니다.");
        }
    });


});












/*
 * 모델 선택
 */
var modelNameTypeJson = {};

$(document).ready(function () {
    var $modelList = $('.selectmodel');

    // AJAX 요청으로 데이터를 불러오는 함수
    function loadPromptModelList() {
        $.ajax({
            type: "POST",
            url: "getAllPromptModelList.do",
            success: function (data) {
                // 데이터를 <option> 태그로 변환하고 select 요소에 추가
            	$.each(data, function(index, value){
                    var option = new Option(value.modelName, value.modelName);
                    $modelList.append($(option));
                    
                    modelNameTypeJson[value.modelName] = value.modelType; 
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
var selectedModel = "";
var currentParamValueJson = {};

$('.selectmodel').on('select2:select', function (e) {
    selectedModel = e.params.data.text; // 사용자가 선택한 옵션의 텍스트 값

    // 기존 파라미터를 표시하는 영역을 초기화
    var paramContainer = document.querySelector('.paramall');
    paramContainer.innerHTML = '';
    currentParamValueJson = {};  // 현재 파라미터 값을 저장하는 객체 초기화

    $.ajax({
        type: "POST",
        data: { selectedModelTypeName: modelNameTypeJson[selectedModel] },
        url: "getParamMasterByParamId.do",
        success: function (data) {
            $.each(data, function(index, value){
                var newParamDiv = document.createElement('div');
                newParamDiv.classList.add('param');
                newParamDiv.innerHTML = `
                    <div class="param-1">
                        <div class="paramtitle">${value.parameterName}</div>
                        <div class="prograss">
                            <input type="range" class="parambar" id="parambar" value="${value.defaultValue}"
                                min="${value.minValue}" max="${value.maxValue}">
                            <input type="text" class="paramInput" id="paramInput" value="${value.defaultValue}">
                        </div>
                    </div>`;
                paramContainer.appendChild(newParamDiv);
                
                var progressBar = newParamDiv.querySelector('.parambar');
                let textInput = newParamDiv.querySelector('.paramInput');
                
                currentParamValueJson[value.parameterName] = textInput.value; 

                // 파라미터 값 변동
                progressBar.addEventListener('input', function() {
                    textInput.value = this.value;

                    currentParamValueJson[value.parameterName] = textInput.value; 
                });
            });
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

 
 
/*
 * 시스템 프롬프트 선택
 */
var selectedSystemPrompt;
 
$(document).ready(function () {
	// 시스템 프롬프트 선택 localStorage 초기화
	localStorage.removeItem("selectSystemPrompt");

    var $promptList = $('.promptlist');

    // AJAX 요청으로 데이터를 불러오는 함수
    function loadPromptData() {
        $.ajax({
            type: "POST",
            url: "getPromptSystemInfo.do",
            success: function (data) {
            	var systemPromptInfoJson = {};
            	
                // 데이터를 <option> 태그로 변환하고 select 요소에 추가
                data.forEach(function (item) {
                	var systemPromptName = item.systemPromptName;
                	systemPromptInfoJson[systemPromptName] = item;
                	
                    var option = new Option(systemPromptName, systemPromptName);
                    $promptList.append($(option));
                });
                
            	localStorage.setItem("selectSystemPrompt", JSON.stringify(systemPromptInfoJson));
// console.log(localStorage.getItem("selectSystemPrompt"));

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

// 선택한 시스템 프롬프트 옵션을 배열에 저장
$('.promptlist').on('change', function (e) {      
    // 선택된 옵션들의 텍스트 배열을 가져오기
    selectedSystemPrompt = $(this).find('option:selected').map(function () {
        return $(this).text();
    }).get();

    // 배열 출력
    console.log("selectedSystemPrompt: ", selectedSystemPrompt);

});



/*
 * 변수 추가
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
 * 챗봇
 */
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
let userText = null;
var chatHistoryText = "";

const createChatElement = (content, className) => {
	// Create new div and apply chat, specified class and set html content of
	// div
	const chatDiv = document.createElement("div");
	chatDiv.classList.add("chat", className);
	chatDiv.innerHTML = content;
	return chatDiv; // Return the created chat div
}


// Chatbot 응답 주는 function ajax로 처리.
const getChatResponse = async (incomingChatDiv) => {
	const pElement = document.createElement("p");
	
	console.log("selectedModel: "+ selectedModel);
	
	// chat history + current chat
	var promptInputStr = "# History #\n" + chatHistoryText + "\nUSER: " + userText;

	// 직접 입력한 시스템 프롬프트
	var systempPromptInputStr = document.getElementById("promptarea").value;

	if (systempPromptInputStr.length !== 0 && systempPromptInputStr.charAt(systempPromptInputStr.length - 1) !== ".") {
		systempPromptInputStr += ".";
	}
	
	console.log("systempPromptInputStr: " + systempPromptInputStr);
	
	// 선택한 시스템 프롬프트
	var selectedSystemPromptStr = "";
	var selectSystemPromptKeys = Object.keys(JSON.parse(localStorage.getItem("selectSystemPrompt")));

	for (var selected of selectedSystemPrompt) {
		if (!selectSystemPromptKeys.includes(selected)) {
			continue;
		}
		
		var temp = JSON.parse(localStorage.getItem("selectSystemPrompt"))[selected];

		if (selectedSystemPromptStr.length != 0) {
			selectedSystemPromptStr += " ";
		}
		
		selectedSystemPromptStr += temp.systemPrompt;
		
		if (selectedSystemPromptStr.charAt(selectedSystemPromptStr.length - 1) !== ".") {
			selectedSystemPromptStr += ".";
		}
		
		console.log("selectedSystemPromptStr: ",selectedSystemPromptStr);

	}
	
	
	console.log("최종 system_prompt: ", selectedSystemPromptStr + " " + systempPromptInputStr);


	
	// FIXME
	var requestParam = {
			"prompt_id" : "test",
			"model" : selectedModel,
			"prompt" : promptInputStr,
			"system_prompt" : selectedSystemPromptStr + " " + systempPromptInputStr,
			"properties" : currentParamValueJson,
			"file_path_list" : "",
			"additional_work" : ""
			};

	if (localStorage.getItem(JSON.stringify(requestParam)) != null) {
		console.log("local storage is not null");
		
		var tempReturnData = JSON.parse(localStorage.getItem(JSON.stringify(requestParam)));

		setTimeout(function() {
			pElement.textContent = tempReturnData.prompt_result;
			chatTypeingEnd(incomingChatDiv, pElement);
		}, 1000);
		
	} else {		
		$.ajax({
			type: "POST",
			url: "getChatbotResponse.do",
			data: { requestParam : JSON.stringify(requestParam) },
			dataType: "json",
			async: true, // 요청을 동기적으로 보내기 위해 async 옵션을 false로 설정
			success: function(data, status) {				
				pElement.textContent = data.prompt_result;

				localStorage.setItem(JSON.stringify(requestParam), JSON.stringify(data));
				chatTypeingEnd(incomingChatDiv, pElement);

				// chat history
				if (chatHistoryText.length != 0){
					chatHistoryText = chatHistoryText + "\n";
				}
				
				chatHistoryText = chatHistoryText + "USER: " + userText + "\nBOT: " + pElement.textContent;
				console.log(chatHistoryText);

				
			},
			error: function(xhr, status, error) {
				pElement.classList.add("error");
				pElement.textContent = "죄송합니다. 답변을 드릴 수 없습니다. 잠시후 다시 시도해 주세요.";

				chatTypeingEnd(incomingChatDiv, pElement);
			}
		});
	}
}

function chatTypeingEnd(incomingChatDiv, pElement) {
	incomingChatDiv.querySelector(".typing-animation").remove();
	incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
	localStorage.setItem("all-chats", chatContainer.innerHTML);
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const loadDataFromLocalstorage = () => {
	// Load saved chats and theme from local storage and apply/add on the page
	const themeColor = localStorage.getItem("themeColor");
	chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom
															// of the chat
															// container
}

const copyResponse = (copyBtn) => {
	// Copy the text content of the response to the clipboard
	const reponseTextElement = copyBtn.parentElement.querySelector("p");
	navigator.clipboard.writeText(reponseTextElement.textContent);
	copyBtn.textContent = "done";
	setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {	
	// Display the typing animation and call the getChatResponse function
	// FIXME 절대 경로 설정
	const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/SpelixLLMFramework/resources/img/ai_brain.svg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
	// Create an incoming chat div with typing animation and append it to chat
	// container
	const incomingChatDiv = createChatElement(html, "incoming");

	chatContainer.appendChild(incomingChatDiv);
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
	getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
	userText = chatInput.value.trim(); // Get chatInput value and remove extra
										// spaces
	if (!userText) return; // If chatInput is empty return from here

	// Clear the input field and reset its height
	chatInput.value = "";
	chatInput.style.height = `${initialInputHeight}px`;

	const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/SpelixLLMFramework/resources/img/user3.svg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

	// Create an outgoing chat div with user's message and append it to chat
	// container
	const outgoingChatDiv = createChatElement(html, "outgoing");
	chatContainer.querySelector(".default-text")?.remove();
	chatContainer.appendChild(outgoingChatDiv);
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
	setTimeout(showTypingAnimation, 500);
}


const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
	// Adjust the height of the input field dynamically based on its content
	chatInput.style.height = `${initialInputHeight}px`;
	chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
	// If the Enter key is pressed without Shift and the window width is larger
	// than 800 pixels, handle the outgoing chat
	if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
		e.preventDefault();
		handleOutgoingChat();
	}
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);


