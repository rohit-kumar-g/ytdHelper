function Rule(data) {
	var rules = $('#rules > tbody');
	this.node = $('#rule-template').clone();
	this.node.removeAttr('id');
	this.node.attr('class', 'rule');
	Rule.next_id++;
	this.node.find('.number').html(Rule.next_id);
	rules.append(this.node);
  
	if (data) {
	  this.node.find('.number').text(Rule.next_id);
	  this.node.find('.extension').val(data.extension);
	  this.node.find('.foldername').val(data.foldername);
	}
  
	this.node.find('.extension').on('keyup', function() {
	  storeRules();
	});
  
	this.node.find('.foldername').on('keyup', function() {
	  storeRules();
	});
  
	this.node.find('.remove').on('click', function() {
	  let _this = $(this).parent().parent();
	  
	  _this.nextAll().find('.number').each(function(index, element) {
		let number = $(element).text();
		number--;
		$(element).text(number);
	  });
	  _this.remove();
	  Rule.next_id--;
	  storeRules();
	});
  
	storeRules();
  }
  
  Rule.next_id = 0;
  
  function loadRules() {
	chrome.storage.local.get('rules', function(result) {
	  let rules = result.rules || '[]';
	  try {
		JSON.parse(rules).forEach(function(rule) {
		  new Rule(rule);
		});
	  } catch (e) {
		// Handle JSON parse error if needed
		console.error("Failed to parse rules from local storage:", e);
	  }
	});
  }
  
  function storeRules() {
	var array = [];
	
	$('.rule').each(function(index, element) {
	  array.push({
		extension: $(element).find('.extension').val(),
		foldername: $(element).find('.foldername').val()
	  });
	});
  
	let rulesString = JSON.stringify(array);
  
	chrome.storage.local.set({ 'rules': rulesString }, function() {
	  console.log("Rules stored in local storage.");
	});
  
	chrome.storage.sync.set({ 'rules': rulesString }, function() {
	  console.log("Rules stored in sync storage.");
	});
  }
  
  function init() {
	chrome.storage.local.get('defaultFolder', function(result) {
	  $('#defaultFolder').val(result.defaultFolder || 'default');
	});
  
	$('#defaultFolder').on('keyup', function() {
	  let defaultFolder = $('#defaultFolder').val();
	  chrome.storage.local.set({ 'defaultFolder': defaultFolder });
	  chrome.storage.sync.set({ 'defaultFolder': defaultFolder });
	});
	
	$('#new').on('click', function() {
	  new Rule();
	});
	
	loadRules();
  }
  
  window.onload = function() {
	init();
  };
  