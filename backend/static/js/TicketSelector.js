/**
 * Ticket Selector JS
 *
 * By SocialPass, All rights reserved
 */

function updateTierData() {
	var data = [];
	var selectedTiers = document.querySelectorAll(
		"[type=checkbox].ticket-tier-input:checked"
	);
	for (var i = 0; i < selectedTiers.length; i++) {
		var tier = selectedTiers[i];
		data.push({
			id: tier.getAttribute("id"),
			amount: tier.getAttribute("data-amount"),
			extra_party: tier.getAttribute("data-extra-party"),
		});
	}
	document.getElementById("id_ticket_tier_data").value = JSON.stringify(data);
}

function updateTier(tier) {
	var tierLabel = tier
		.closest(".ticket-tier")
		.querySelector(".ticket-tier-label");
	tierLabel.querySelector(".ticket-tier-amount").value =
		tier.getAttribute("data-amount");
	try {
		tierLabel.querySelector(".ticket-tier-extra-party").value =
			tier.getAttribute("data-extra-party");
		tierLabel.querySelector(".ticket-tier-total-selected").innerHTML =
			Number(tier.getAttribute("data-amount")) +
			Number(tier.getAttribute("data-amount")) *
				Number(tier.getAttribute("data-extra-party"));
	} catch (e) {}
	updateTierData();
}

function tierOnchange(tierInput) {
	if (tierInput.checked) {
		tierInput.setAttribute("data-amount", 1);
	} else {
		tierInput.setAttribute("data-amount", 0);
		tierInput.setAttribute("data-extra-party", 0);
	}
	updateTier(tierInput);
}

function subtractAmount(button) {
	var tierInput = button
		.closest(".ticket-tier")
		.querySelector(".ticket-tier-input");
	var amount = Number(tierInput.getAttribute("data-amount"));

	if (amount === 1) {
		tierInput.checked = false;
		tierInput.dispatchEvent(new Event("change"));
	} else if (amount > 1) {
		tierInput.setAttribute("data-amount", amount - 1);
		updateTier(tierInput);
	}
}

function addAmount(button) {
	var tierInput = button
		.closest(".ticket-tier")
		.querySelector(".ticket-tier-input");
	var amount = Number(tierInput.getAttribute("data-amount"));
	var extraParty = Number(tierInput.getAttribute("data-extra-party"));
	var availability = Number(tierInput.getAttribute("data-availability"));
	var maxPerPerson = Number(tierInput.getAttribute("data-max-per-person"));
	var totalSelected = amount + 1 + (amount + 1) * extraParty;

	if (amount === 0) {
		tierInput.checked = true;
		tierInput.dispatchEvent(new Event("change"));
	} else {
		if (amount < maxPerPerson) {
			if (totalSelected <= availability) {
				tierInput.setAttribute("data-amount", amount + 1);
				updateTier(tierInput);
			}
		}
	}
}

function subtractExtraParty(button) {
	var tierInput = button
		.closest(".ticket-tier")
		.querySelector(".ticket-tier-input");
	var extraParty = Number(tierInput.getAttribute("data-extra-party"));

	if (extraParty !== 0) {
		tierInput.setAttribute("data-extra-party", extraParty - 1);
		updateTier(tierInput);
	}
}

function addExtraParty(button) {
	var tierInput = button
		.closest(".ticket-tier")
		.querySelector(".ticket-tier-input");
	var amount = Number(tierInput.getAttribute("data-amount"));
	var extraParty = Number(tierInput.getAttribute("data-extra-party"));
	var availability = Number(tierInput.getAttribute("data-availability"));
	var allowedGuests = Number(tierInput.getAttribute("data-allowed-guests"));
	var totalSelected = amount + amount * (extraParty + 1);

	if (extraParty < allowedGuests) {
		if (totalSelected <= availability) {
			tierInput.setAttribute("data-extra-party", extraParty + 1);
			updateTier(tierInput);
		}
	}
}

function tierTypeOnchange(tierTypeInput) {
	var tiersContainers = document.querySelectorAll(".tiers-container");
	for (var i = 0; i < tiersContainers.length; i++) {
		tiersContainers[i].classList.remove("d-block");
	}
	if (tierTypeInput.checked) {
		document
			.getElementById("tiers-" + tierTypeInput.value)
			.classList.add("d-block");
		document.getElementById("id_checkout_type").value = tierTypeInput.value;

		// Un-select all selected tiers
		var selectedTiers = document.querySelectorAll(
			"[type=checkbox].ticket-tier-input:checked"
		);
		for (var i = 0; i < selectedTiers.length; i++) {
			selectedTiers[i].checked = false;
			selectedTiers[i].dispatchEvent(new Event("change"));
		}
	}
}