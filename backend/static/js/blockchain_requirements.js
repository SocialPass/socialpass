
// Helper functions to manage addition/removal/submission of requirement forms and nav-tabs

var requirementsAbsoluteCounter = 0; // this counter keeps track of how many requirements were added in total. Absolute counter is never decremented. It is used to avoid equal IDs after deleting middle requirements.
var requirementsCounter = 0; // this counter keeps track of how many requirements are in the screen.
var tokenIdsCounter = []; // each requirement has its own token_id counter, at its index of the array.
var currentFormId = 0;

window.onload = function(){
  // adds the requirement forms from the initial data. This data is passed by the server and stored in the form context.

  if (initialRequirementsData.length > 0){
	for (let requirement of initialRequirementsData){
	  addRequirement(requirement)
	}
  } else {
	  //document.getElementById("add-req").click();
  }
}

function addRequirement(initialData = null) {
  // adds a requirement form to the screen.
  let list = document.getElementById("nav-requirement").innerHTML;
  let divId = "requirementDiv-"+requirementsAbsoluteCounter;

  // add nav-item
  list +=
	`
	  <li class="nav-item" role="presentation">
		<button
		  type="button"
		  class="nav-link requirement-nav"
		  id="${divId}-tab"
		  data-bs-toggle="pill"
		  data-bs-target="#${divId}"
		  role="tab"
		>
		  Requirement ${requirementsAbsoluteCounter + 1}
		</button>
	  </li>
	`;
  document.getElementById("nav-requirement").innerHTML = list;

  // adds form to tab-content
  tokenIdsCounter.push(0);
  _createRequirementForm(initialData);
  requirementsCounter++;
  requirementsAbsoluteCounter++;

  // show the added tab and hide the rest
  let triggerEl = document.getElementById(`${divId}-tab`)
  let tabTrigger = new bootstrap.Tab(triggerEl)
  tabTrigger.show()
}

function _createRequirementForm(initialData = null){
  let divId = "requirementDiv-"+requirementsAbsoluteCounter
  let formId = "requirementForm-"+requirementsAbsoluteCounter
  let form = document.getElementById("tokenRequirementForms").innerHTML;

  let new_div = document.createElement("div");
  new_div.id = divId
  new_div.className = "tab-pane fade py-3"
  new_div.role = "tabpanel"
  new_div.innerHTML = `
	 <div class="d-flex align-items-center py-3 mb-5">
	  <label class="form-label mb-0">Blockchain Requirement ${requirementsAbsoluteCounter + 1}</label>
	  <button class="btn bg-gradient-primary btn-sm ms-auto my-0"
			  onclick="deleteRequirement(${requirementsAbsoluteCounter})"
			  type="button"
			  aria-label="Close">
		Remove requirement
	  </button>
	</div>
	<form id="${formId}" onChange="disallowPublish()">
	  <div class="form-group">
		<label for="blockChainSelect">Blockchain <span class="asteriskField">*</span></label>
		<select class="form-control" id="blockChainSelect-${requirementsAbsoluteCounter}">

		</select>
	  </div>
	  <div class="form-group">
		<label for="networkSelect">Network <span class="asteriskField">*</span></label>
		<select required class="form-control" id="networkSelect-${requirementsAbsoluteCounter}">

		</select>
	  </div>
	  <div class="form-group">
		<label for="assetTypeSelect">Asset Type <span class="asteriskField">*</span></label>
		<select required class="form-control" id="assetTypeSelect-${requirementsAbsoluteCounter}" placeholder="ERC20">

		</select>
	  </div>
	  <div class="form-group">
		<label for="assetAdressInput">Asset Address <span class="asteriskField">*</span></label>
		<input required pattern="^(0x|0X).*$" required type="text" class="form-control" id="assetAdressInput-${requirementsAbsoluteCounter}"
				oninvalid="this.setCustomValidity('Asset Address must start with 0x')"
				oninput="this.setCustomValidity('')">
	  </div>
	  <div class="form-group">
		<label for="requiredAmountInput">Required Amount <span class="asteriskField">*</span></label>
		<input required type="number" class="form-control" id="requiredAmountInput-${requirementsAbsoluteCounter}">
	  </div>
	  <div>
		Token IDs
		<i type="button" onclick="addNewTokenIdToRequirement(${requirementsAbsoluteCounter})" class="fa-regular fa-add"></i>
		|
		<i type="button" onclick="popTokenIdFromRequirement(${requirementsAbsoluteCounter})" class="fa-regular fa-trash-can"></i>
	  </div>
	  <hr/>
	  <div id="tokenIdGroup-${requirementsAbsoluteCounter}" class="d-flex flex-column align-items-start gap-3 mt-2"></div>
	</form>
  `;
  document.getElementById("tokenRequirementForms").appendChild(new_div);



  let select;

  select = document.getElementById(`blockChainSelect-${requirementsAbsoluteCounter}`)
  for (var [key, value] of Object.entries(blockchainOptions)) {
	select.innerHTML +=  `<option value="${key}">${value}</option>`;
  }

  select = document.getElementById(`networkSelect-${requirementsAbsoluteCounter}`)
  for (var [key, value] of Object.entries(chainOptions)) {
	select.innerHTML += `<option value="${key}">${value}</option>`;
  }

  select = document.getElementById(`assetTypeSelect-${requirementsAbsoluteCounter}`)
  for (var [key, value] of Object.entries(assetTypeOptions)) {
	select.innerHTML += `<option value="${key}">${value}</option>`;
  }

  if (initialData){
	// fill from initial data
	document.getElementById("blockChainSelect-"+requirementsAbsoluteCounter).value = initialData.blockchain
	document.getElementById("networkSelect-"+requirementsAbsoluteCounter).value = initialData.chain_id
	document.getElementById("assetTypeSelect-"+requirementsAbsoluteCounter).value = initialData.asset_type
	document.getElementById("requiredAmountInput-"+requirementsAbsoluteCounter).value = initialData.amount
	document.getElementById("assetAdressInput-"+requirementsAbsoluteCounter).value = initialData.asset_address

	for (let token_id of initialData.token_id){
	  addNewTokenIdToRequirement(requirementsAbsoluteCounter, token_id)
	}
  }
}

function deleteRequirementForm(requirementIdx) {
  document.getElementById(`requirementDiv-${requirementIdx}`).remove();
}

function deleteRequirement(requirementIdx) {
  document.getElementById(`requirementDiv-${requirementIdx}-tab`).parentNode.remove(); // remove nav-tab
  deleteRequirementForm(requirementIdx);
  // requirementsAbsoluteCounter is not decremented
  requirementsCounter--;

  let triggerEl = document.getElementsByClassName('nav-link requirement-nav')[requirementsCounter - 1]
  let tabTrigger = new bootstrap.Tab(triggerEl)
  tabTrigger.show()
}

function popTokenIdFromRequirement(requirementIdx){
  document.getElementById(`tokenId-${requirementIdx}-${tokenIdsCounter[requirementIdx] - 1}`).remove();
  tokenIdsCounter[requirementIdx] = tokenIdsCounter[requirementIdx] - 1;
}

function addNewTokenIdToRequirement(requirementIdx, initialData=[null]){
  const tokenIdGroupId = 'tokenIdGroup-'+ requirementIdx

  let list = document.getElementById(tokenIdGroupId);

  let new_div = document.createElement('div');
  new_div.id = `tokenId-${requirementIdx}-${tokenIdsCounter[requirementIdx]}`
  new_div.innerHTML =
	  `
		<label>Token ID ${tokenIdsCounter[requirementIdx]}</label>
		<input type="text" class="form-control d-inline-block w-auto" value="${initialData? initialData : ""}">
		<hr/>
	`;
  document.getElementById(tokenIdGroupId).appendChild(new_div);
  tokenIdsCounter[requirementIdx] = tokenIdsCounter[requirementIdx] + 1;
}

function fillRequirementsAndSubmitForm(){
  let requirementsData = []
  for (let requirementIdx = 0; requirementIdx < requirementsAbsoluteCounter; requirementIdx++){
	let requirementForm = document.getElementById(`requirementForm-${requirementIdx}`)
	if (requirementForm == null){
	  continue
	}

	if (!requirementForm.checkValidity()){
	  let triggerEl = document.getElementById(`requirementDiv-${requirementIdx}-tab`)
	  let tabTrigger = new bootstrap.Tab(triggerEl)
	  tabTrigger.show()
	  location.hash = "#tokenRequirementForms";
	  setTimeout(() => {requirementForm.reportValidity()}, 1000) // schedule validation on queue because tab.show() is async
	  return
	}

	requirementData = {
	  "blockchain": document.getElementById("blockChainSelect-"+requirementIdx).value,
	  "chain_id": parseInt(document.getElementById("networkSelect-"+requirementIdx).value, 10),
	  "asset_type": document.getElementById("assetTypeSelect-"+requirementIdx).value,
	  "amount": parseInt(document.getElementById("requiredAmountInput-"+requirementIdx).value, 10),
	  "asset_address": document.getElementById("assetAdressInput-"+requirementIdx).value,
	  "token_id": []
	}
	for (let token_idx = 0; token_idx < tokenIdsCounter[requirementIdx]; token_idx++){
	  requirementData["token_id"].push(
		parseInt(document.getElementById(`tokenId-${requirementIdx}-${token_idx}`).getElementsByTagName('input')[0].value, 10)
	  )
	}
	requirementsData.push(requirementData)
  }
  document.getElementById('id_requirements').value = JSON.stringify(requirementsData);

  let form = document.getElementById('event-form');
  if (form.reportValidity()){
	form.submit();
  }
}
