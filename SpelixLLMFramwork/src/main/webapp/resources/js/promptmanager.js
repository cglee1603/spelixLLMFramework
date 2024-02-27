var pageSize = 10;
var modelNameTypeJson = {};
window.promptData = []; // 전역 변수로 프롬프트 데이터 저장

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
			var option = new Option(value.modelName, value.modelName);
			$modelSelect.append(option);
			modelNameTypeJson[value.modelName] = value.modelType;
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

function setupEventHandlers() {
	$('#select-all-checkbox').change(function() {
		$('.prompt-checkbox').prop('checked', $(this).is(':checked'));
	});

	$('.prompt-delete-button').click(deleteSelectedPrompts);

	  // 모델 선택 변경 이벤트
    $('#search-model-list').change(filterAndDisplayData);
}

function initializePagination(data, pageSize) {
	var pageCount = Math.ceil(data.length / pageSize);
	$(".pagination").empty().off('click').on('click', 'li', function() {
		var currentPage = $(this).index() + 1;
		displayPage(currentPage, data, pageSize);
	});
	for (var i = 1; i <= pageCount; i++) {
		$(".pagination").append('<li><a href="#">' + i + '</a></li>');
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
		return cell.html('<button type="button" class="prompt-verification-button">검증</button>');
	} else if (header.field === "useYN") {
		var buttonText = cellValue === 'Y' ? '사용 중' : '미사용';
		return cell.html('<button type="button" class="prompt-useyn-button">' + buttonText + '</button>');
	} else {
		return cell.text(cellValue);
	}
}



//프롬프트 삭제 이벤트
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

