
/*
 * 시스템 프롬프트 선택
 */
var $promptList = $('.promptlist');

$(document).ready(function () {
	localStorage.removeItem("systemPromptSelectOption");
	localStorage.removeItem("systemPromptSelectedValue");
	localStorage.removeItem("systemPromptInputValue");

    function loadPromptData() {
        $.ajax({
            type: "POST",
            url: "getPromptSystemInfo.do",
            success: function (data) {
            	var systemPromptInfoJson = {};
            	
                data.forEach(function (item) {
                	var systemPromptName = item.systemPromptName;
                	systemPromptInfoJson[systemPromptName] = item;
                	
                    var option = new Option(systemPromptName, systemPromptName);
                    $promptList.append($(option));
                });
                
            	localStorage.setItem("systemPromptSelectOption", JSON.stringify(systemPromptInfoJson));

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

    loadPromptData();

});


$promptList.on('change', function (e) {
    var selectedSystemPrompt = $(this).find('option:selected').map(function () {
        return $(this).text();
    }).get();

	var selectedSystemPromptStr = "";

    for (var selectedValue of selectedSystemPrompt) {
    	if (selectedSystemPromptStr.length != 0) {
			selectedSystemPromptStr += " ";
		}
    
    	selectedSystemPromptStr += JSON.parse(localStorage.getItem("systemPromptSelectOption"))[selectedValue].systemPrompt;
    	
    	if (selectedSystemPromptStr.charAt(selectedSystemPromptStr.length - 1) !== ".") {
			selectedSystemPromptStr += ".";
		}
    	
    }

    localStorage.setItem("systemPromptSelectedValue", selectedSystemPromptStr);
    
});




/*
 * 시스템 프롬프트 입력
 */
var promptArea = document.getElementById('promptarea');

promptArea.addEventListener('input', function() {
    var currentPromptValue = promptArea.value;
    
    if (currentPromptValue.length !== 0 && currentPromptValue.charAt(currentPromptValue.length - 1) !== ".") {
    	currentPromptValue += ".";
    	localStorage.setItem("systemPromptInputValue", currentPromptValue);
        
    	console.log('현재 입력한 시스템 프롬프트:', currentPromptValue);
    }

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
        document.getElementById("variableInput").value = "";
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
var chatInput = document.querySelector("#chat-input");
var sendButton = document.querySelector("#send-btn");
var chatContainer = document.querySelector(".chat-container");
var userText = null;
var chatHistoryText = "";
var systemPromptConcat = "";

const createChatElement = (content, className) => {
	const chatDiv = document.createElement("div");
	chatDiv.classList.add("chat", className);
	chatDiv.innerHTML = content;
	return chatDiv;
}


const getChatResponse = async (incomingChatDiv) => {
	const pElement = document.createElement("p");
	
	console.log("selectedModel: "+ selectedModel);
	
	// chat history + current chat
	var promptInputStr = "# History #\n" + chatHistoryText + "\nUSER: " + userText;
	
	// 최종 system prompt
	systemPromptConcat = (localStorage.getItem("systemPromptSelectedValue") == null)?"":localStorage.getItem("systemPromptSelectedValue") 
			 + " " + (localStorage.getItem("systemPromptInputValue") == null)?"":localStorage.getItem("systemPromptInputValue");
	
	// FIXME
	var requestParam = {
			"prompt_id" : "test",
			"model" : selectedModel,
			"prompt" : promptInputStr,
			"system_prompt" : systemPromptConcat,
			"properties" : currentParamValueJson,
			"file_path_list" : "",
			"additional_work" : ""
			};

	// TODO localStorage 비울 필요 없는 지 확인 필요
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
			async: true,
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

// TODO 기능 동작, 필요 여부 확인 필요
const loadDataFromLocalstorage = () => {
	const themeColor = localStorage.getItem("themeColor");
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
	const reponseTextElement = copyBtn.parentElement.querySelector("p");
	navigator.clipboard.writeText(reponseTextElement.textContent);
	copyBtn.textContent = "done";
	setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
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
	const incomingChatDiv = createChatElement(html, "incoming");

	chatContainer.appendChild(incomingChatDiv);
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
	getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
	userText = chatInput.value.trim();
	if (!userText) return;

	chatInput.value = "";
	chatInput.style.height = `${initialInputHeight}px`;

	const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/SpelixLLMFramework/resources/img/user3.svg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                </div>`;

	const outgoingChatDiv = createChatElement(html, "outgoing");
	chatContainer.querySelector(".default-text")?.remove();
	chatContainer.appendChild(outgoingChatDiv);
	chatContainer.scrollTo(0, chatContainer.scrollHeight);
	setTimeout(showTypingAnimation, 500);
}


const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
	chatInput.style.height = `${initialInputHeight}px`;
	chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
		e.preventDefault();
		handleOutgoingChat();
	}
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);


