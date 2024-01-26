

//function selectPromptSample(promptId, promptName, promptDesc){
//	var postData = {
//			"promptId": promptId,
//			"promptName": promptName,
//			"promptDesc": promptDesc
//	};
//	$.ajax({
//		url: "selectPromptSample.do",
//		type: "POST",
//		data: postData,
//		success: function(response){
//			alert("프롬프트 선택을 완료했습니다.");
//			opener.location.reload();
//			window.close();
//		},
//		error: function(error){
//			alert("프롬프트를 불러오는 데 실패했습니다.");
//		}
//	})
//}

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

/*// 시스템 프롬프트 선택
 $(document).ready(function () {
	    $('.promptlist').select2({
	        ajax: {
	            type: "POST",
	            url: "getPromptSystemNameList.do",
	            processResults: function (data) {
	            	console.log(data);
	                return {
	                    results: $.map(data, function (value) {
//	                    	console.log(value);
	                        return { id: value, text: value };
	                    })
	                };
	            },
	            error: function (error) {
	                alert("시스템 프롬프트를 가져오는 데 실패했습니다.")
	            }
	        },
	        placeholder: '프롬프트를 선택해 주세요',
	        multiple: true
	    }).on('change', function (e) {
	        var selectedValues = $(this).val();
	        console.log(selectedValues); // 선택된 값들을 콘솔에 출력

	        // 선택된 값을 어떤 HTML 엘리먼트에 표시하고자 하는 경우
	        $('#selectedValuesDisplay').text(selectedValues.join(', '));
	    });

	});*/
	
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

    // 이벤트 핸들러
$promptList.on('change', function () {
    var selectedValues = $(this).val();
    
    // selectedValues가 배열이 아닌 경우 배열로 변환
    if (!Array.isArray(selectedValues)) {
        selectedValues = [selectedValues];
    }

    console.log(selectedValues);
    $('#selectedValuesDisplay').text(selectedValues.join(', '));
});

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

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");

const createChatElement = (content, className) => {
	// Create new div and apply chat, specified class and set html content of
	// div
	const chatDiv = document.createElement("div");
	chatDiv.classList.add("chat", className);
	chatDiv.innerHTML = content;
	return chatDiv; // Return the created chat div
}

var tempChatbotAnswer = "";

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
	// console.log("전송버튼")

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

/* 파라미터 동적 생성 */

document.getElementById('selectmodel').addEventListener('change', function() {
  var selectedModel = this.value;
  var parameters;
 
 // 모델에 따른 파라미터 설정 (실제로는 서버에서 데이터를 가져올 수 있습니다 - parameters를 db 혹은 다른데서 조회)
if (selectedModel === '1') {
parameters = [
{ title: 'Max response for Llama', value: 1, min: 1, max: 100 },
// 추가 파라미터
];
} else if (selectedModel === '2') {
parameters = [
{ title: 'Max response for GPT', value: 1, min: 1, max: 200 },
// 추가 파라미터
];
}

 // 기존 param 요소들을 제거
 var paramContainer = document.querySelector('.paramall');
 paramContainer.innerHTML = '';

 // 새로운 param 요소들을 생성 및 추가
 parameters.forEach(param => {
   var newParamDiv = document.createElement('div');
   newParamDiv.classList.add('param');
   newParamDiv.innerHTML = `
     <div class="param-1">
       <div class="paramtitle">${param.title}</div>
       <div class="prograss">
         <input type="range" class="parambar" id="parambar" value="${param.value}" min="${param.min}" max="${param.max}">
         <input type="text" class="paramInput" id="paramInput" value="${param.value}">
       </div>
     </div>`;
   paramContainer.appendChild(newParamDiv);
   
var progressBar = newParamDiv.querySelector('.parambar');
var textInput = newParamDiv.querySelector('.paramInput');
    console.log(textInput);
    progressBar.addEventListener('input', function() {
      textInput.value = this.value;
	   });
 });
});