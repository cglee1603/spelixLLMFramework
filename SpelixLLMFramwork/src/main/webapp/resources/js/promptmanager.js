var pageSize = 10;
var currentPage = 1; 
//var modelNameTypeJson = {};
//window.promptData = []; // 전역 변수로 프롬프트 데이터 저장

$(document).ready(function() {
	loadPromptModelList();
	loadPromptData();
	setupEventHandlers();
});

function loadPromptModelList() {
	var $modelSelect = $('#search-model-list');
	ajaxCall("POST", "promptmanager/getAllPromptModelList.do", {}, 
			function(data) {
		data.forEach(function(value) {
			var option = new Option(value.modelName, value.modelId);
			$modelSelect.append(option);
//			modelNameTypeJson[value.modelName] = value.modelType;
		});
	},
	function() {
		alert("모델을 가져오는 데 실패했습니다.");
	}
	);
}

function loadPromptData() {
	ajaxCall("POST", "promptmanager/getAllPromptMaster.do", {},
			   function(data) {
        // 필터링 로직을 추가하기 위해 전역 변수에 저장
        window.allPromptData = data;
        filterAndDisplayData();
    },
    function() {
        alert("프롬프트 마스터를 가져오는 데 실패했습니다.");
    }
);
}

// 기존 setupEventHandlers 함수에 이벤트 핸들러 추가
function setupEventHandlers() {
	$('#select-all-checkbox').change(function() {
		$('.prompt-checkbox').prop('checked', $(this).is(':checked'));
	});

	$('.prompt-delete-button').click(deleteSelectedPrompts);

    $('#search-model-list').change(filterAndDisplayData);

    // 사용 여부 버튼에 대한 이벤트 핸들러 추가
    $(document).on('click', '.prompt-useyn-button', function() {
        var $button = $(this);
        var promptId = $button.closest('tr').find('.promptId').text();

        $.ajax({
            url: '/path/to/update', // 실제 서버의 URL로 변경
            method: 'POST',
            data: { id: promptId },
            success: function(response) {
                if(response === 'Y') {
                    $button.text('사용').removeClass('btn-secondary').addClass('btn-success');
                } else {
                    $button.text('미사용').removeClass('btn-success').addClass('btn-secondary');
                }
            },
            error: function() {
                alert('오류가 발생했습니다.');
            }
        });
    });
    
    // 검증 버튼 클릭 이벤트 핸들러
    $(document).on('click', '.prompt-verification-button', function() {
    	 $('#prompt-verification-modal').show();
    });

    // 모달 닫기 버튼 이벤트 핸들러
    $(document).on('click', '.prompt-close-button', function() {
        $('#prompt-verification-modal').hide();
    });
    
    // 여기에 다른 이벤트 핸들러들을 추가할 수 있습니다.
}





function initializePagination(data, pageSize) {
    var pageCount = Math.ceil(data.length / pageSize);
    var $pagination = $(".pagination");

    $pagination.empty().off('click').on('click', 'li', function() {
        var $this = $(this);
        if($this.hasClass('disabled')) {
            return false;
        }
        var newPage = $this.data('page');
        if(newPage === 'prev') {
            currentPage = Math.max(currentPage - 1, 1);
        } else if(newPage === 'next') {
            currentPage = Math.min(currentPage + 1, pageCount);
        } else {
            currentPage = newPage;
        }
        displayPage(currentPage, data, pageSize);
        updatePaginationButtons($pagination, pageCount);
    });

    // 페이지네이션 버튼 추가 (이전, 숫자, 다음)
    addPaginationButtons($pagination, pageCount);

    // 페이지네이션 버튼 상태 업데이트
    updatePaginationButtons($pagination, pageCount);
}

function addPaginationButtons($pagination, pageCount) {
    $pagination.append('<li class="page-item" data-page="prev"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
    for (var i = 1; i <= pageCount; i++) {
        $pagination.append('<li class="page-item" data-page="' + i + '"><a class="page-link" href="#">' + i + '</a></li>');
    }
    $pagination.append('<li class="page-item" data-page="next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
}

function updatePaginationButtons($pagination, pageCount) {
    $pagination.find('li').removeClass('active disabled');
    $pagination.find('li').eq(currentPage).addClass('active');
    if(currentPage === 1) {
        $pagination.find('li[data-page="prev"]').addClass('disabled');
    }
    if(currentPage === pageCount) {
        $pagination.find('li[data-page="next"]').addClass('disabled');
    }
}


function displayPage(page, data, pageSize) {
	var start = (page - 1) * pageSize;
	var end = start + pageSize;
	var $tableBody = $("#prompt-table tbody").empty();
	var headers = getHeaders();

	data.slice(start, end).forEach(function(item) {
		var row = $('<tr/>').append(getCheckboxCell(item.promptId));
		headers.forEach(function(header) {
			row.append(getTableCell(item, header));
		});
		$tableBody.append(row);
	});
}

function filterAndDisplayData() {
    var selectedModel = $('#search-model-list').val();
    var filteredData = window.allPromptData.filter(function(item) {
        return selectedModel === 'all' || item.model === selectedModel;
    });

    initializePagination(filteredData, pageSize);
    displayPage(1, filteredData, pageSize);
}

function ajaxCall(method, url, data, successCallback, errorCallback) {
	$.ajax({
		type: method,
		url: url,
		data: data,
		success: successCallback,
		error: errorCallback
	});
}

function getHeaders() {
	return $("#prompt-table thead th").map(function() {
		return {
			field: $(this).data('field'),
			class: $(this).attr('class')
		};
	}).get().filter(header => header.field);
}

function getCheckboxCell(value) {
	return $('<td/>').append($('<input />', {
		type: 'checkbox',
		class: 'prompt-checkbox',
		name: 'selection',
		value: value
	}));
}

function getTableCell(item, header) {
    var cellValue = item[header.field] || '';
    var cell = $('<td/>').addClass(header.class);

    if (header.field === "verification") {
        return cell.html('<button type="button" class="btn prompt-verification-button">검증</button>');
    } else if (header.field === "useYN") {
        var buttonText = cellValue === 'Y' ? '사용' : '미사용';
        var buttonClass = cellValue === 'Y' ? 'btn btn-success' : 'btn btn-secondary';
        return cell.html('<button type="button" class="' + buttonClass + '">' + buttonText + '</button>');
    }  else if (header.field === "parmJson") {
        // JSON 데이터를 파싱하여 'parameterName: defaultValue' 형식으로 변환
        var formattedData = '';
        try {
            var jsonData = JSON.parse(cellValue);
            Object.keys(jsonData).forEach(function(key) {
                var param = jsonData[key];
                formattedData += param.parameterName + ': ' + param.defaultValue + '<br>';
            });
        } catch (e) {
            formattedData = 'Invalid JSON';
        }
        return cell.html(formattedData);
    } else {
        return cell.text(cellValue);
    }
}



/*
 * 프롬프트 삭제 이벤트
 */
function deleteSelectedPrompts() {
	var selectedPromptIds = getSelectedPromptIds();

	if (selectedPromptIds.length === 0) {
		alert('삭제할 항목을 선택해주세요.');
		return;
	}

	deletePrompts(selectedPromptIds, function(success) {
		if (success) {
			removeDeletedPromptsFromTable(selectedPromptIds);
		} else {
			alert('삭제에 실패했습니다.');
		}
	});
}

function getSelectedPromptIds() {
	return $('.prompt-checkbox:checked').map(function() {
		return $(this).val();
	}).get();
}

function deletePrompts(promptIds, callback) {
	$.ajax({
		type: 'POST',
		url: 'promptmanager/deletePromptMasterById.do',
		traditional: true,
		data: { 'promptId': promptIds },
		success: function(response) {
			callback(response > 0);
		},
		error: function() {
			callback(false);
		}
	});
}

function removeDeletedPromptsFromTable(promptIds) {
	promptIds.forEach(function(id) {
		$('input[value="' + id + '"]').closest('tr').remove();
	});
}


/*
 * 검증 팝업에서 테스트 버튼 클릭 시 발생하는 이벤트
 */
$('.prompt-test-button').on('click', function() {
// alert('검증을 시작합니다.');

    var requestParam = new Object();
    requestParam.model = $('.model-area .model').text();
    requestParam.prompt = $('.test-prompt-area .prompt-edit-text').val();
    
    //TODO 
    requestParam.system_prompt = '반말';
    requestParam.properties = { max_token: '500' };
    
    
    requestParam.file_path_list = "";
    requestParam.additional_work = "";
    
    data = {
        requestParam: JSON.stringify(requestParam),
        promptTestId: $('.prompt-test-id-area .promptTestId').text(),
        promptId: $('.prompt-Id-area .promptId').text(),
        promptVer: $('.prompt-Ver-area .promptVer').text(),
    };

    ajaxCall("POST", 'promptmanager/getPromptTestDataResultById.do', data,
        function(data) {

            var tbody = document.querySelector('.rate-table tbody');

            data.forEach(function(item) {
            	
            	console.log("item: ",item)
            	
                var row = document.createElement('tr');

                // 클로저를 사용하여 item 변수를 접근할 수 있도록 함
                $(row).data('item', item);

                // 각 열(td)에 데이터 추가
                var testIdCell = document.createElement('td');
                testIdCell.textContent = item.prompt_id;
                row.appendChild(testIdCell);

                // FIXME
                var changesCell = document.createElement('td');
                changesCell.textContent = '';
                row.appendChild(changesCell);

                var accuracyCell = document.createElement('td');
                accuracyCell.textContent = item.answer_cosine_similarity;
                row.appendChild(accuracyCell);

                // tbody에 행 추가
                tbody.appendChild(row);
            });



        },
        function() {
            alert("테스트 데이터 검증 실패.");
        }
    );
});


// 검증 시 오른쪽에 상세 화면 띄우기
$('.rate-table tbody').on('click', 'tr', function() {
    // 클릭한 행에서 데이터 가져오기
    var item = $(this).data('item');
    console.log("clicked item: ", item);

    // 가져온 데이터를 response-table에 추가
    var newRow = $('<tr>');
    newRow.append($('<td>').text(item.question));
    newRow.append($('<td>').text(item.answer));
    newRow.append($('<td>').text(item.prompt_result));
    newRow.append($('<td>').text((item.answer_cosine_similarity > 0.2) ? 'O' : 'X'));

    // response-table의 tbody에 새로운 행 추가
    $('.response-table tbody').html(newRow);
});




/*
 * 검증 팝업에서 프롬프트 마스터 데이터 띄우기
 */
$(document).on('click', '.prompt-verification-button', function() {

    // 클릭된 버튼에 해당하는 데이터를 가져오는 로직을 여기에 추가합니다.
    var rowData = {};
    $(this).closest('tr').find('td').each(function() {
        var columnClass = $(this).attr('class');
        var columnData = $(this).text();
        rowData[columnClass] = columnData;
    });
    
	console.log('rowData: ',rowData);

    
	$('.prompt-Id-area .promptId').text(rowData.promptId);
	$('.prompt-test-id-area .promptTestId').text(rowData.promptTestId);
	$('.prompt-Ver-area .promptVer').text(rowData.promptVer);
	$('.model-area .model').text(rowData.model);
	$('.test-prompt-area .prompt-edit-text').text(rowData.prompt);
	$('.sys-prompt-etc-area .sysPromptEtc').text(rowData.sysPromptEtc);

	

	// TODO 파라미터, 시스템 프롬프트 선택
//	$('.parmJson-area .paramJson').text(rowData.model);
	
	// JSON 파싱 및 프로그레스 바 생성 - FIX_DS
    if(rowData.paramJson) {
        var parmJson = JSON.parse(rowData.parmJson);
        var paramContainer = document.querySelector('.parmJson-area .paramJson');
        parmJson.forEach(function(json, index) {
            createParam(paramContainer, json, index);
        });
    }
    
    function createParam(paramContainer, json, index) {
        // 프로그레스 바 생성 로직
        var newParamDiv = document.createElement('div');
        newParamDiv.classList.add('param');
        newParamDiv.innerHTML = `
            <div class="param-1">
                <div class="paramtitle">${json.parameterName}</div>
                <div class="prograss">
                    <input type="range" class="parambar" id="parambar-${index}" value="${json.defaultValue}"
                        min="${json.minValue}" max="${json.maxValue}">
                    <input type="text" class="paramInput" id="paramInput-${index}" value="${json.defaultValue}">
                </div>
            </div>`;
        paramContainer.appendChild(newParamDiv);

        // 프로그레스 바 이벤트 리스너 추가
        var progressBar = newParamDiv.querySelector('.parambar');
        let textInput = newParamDiv.querySelector('.paramInput');

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
    }
	
	

	
	
	// test history 가져오기
	console.log($('.prompt-Id-area .promptId').text())
	ajaxCall("POST", 'promptmanager/getPromptRateHistoryByPromptId.do', {promptId: $('.prompt-Id-area .promptId').text()},
	        function(data) {

	            var tbody = document.querySelector('.rate-table tbody');

	            data.forEach(function(item) {

	            	var row = document.createElement('tr');
	                // 클로저를 사용하여 item 변수를 접근할 수 있도록 함
	                $(row).data('item', item);

	                // 각 열(td)에 데이터 추가
	                var testIdCell = document.createElement('td');
	                testIdCell.textContent = item.promptRateHistId;
	                row.appendChild(testIdCell);

	                // FIXME
	                var changesCell = document.createElement('td');
	                changesCell.textContent = '';
	                row.appendChild(changesCell);

	                var accuracyCell = document.createElement('td');
	                accuracyCell.textContent = item.promptRate;
	                row.appendChild(accuracyCell);

	                // tbody에 행 추가
	                tbody.appendChild(row);
	            });



	        },
	        function() {
	            alert("프롬프트 테스트 히스토리 가져오기 실패.");
	        });
	

});

