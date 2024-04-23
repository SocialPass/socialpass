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
	var totalPrice = 0;
	for (var i = 0; i < selectedTiers.length; i++) {
		var tier = selectedTiers[i];
		data.push({
			id: tier.getAttribute("data-pk"),
			amount: tier.getAttribute("data-amount"),
			selected_guests: tier.getAttribute("data-extra-party"),
		});
		if (!isNaN(tier.getAttribute("data-price-per-ticket"))) {
			totalPrice +=
				Number(tier.getAttribute("data-price-per-ticket")) *
				Number(tier.getAttribute("data-amount"));
		}
	}
	if (data.length > 0) {
		document.getElementById("id_ticket_tier_data").value =
			JSON.stringify(data);
	} else {
		document.getElementById("id_ticket_tier_data").value = "";
	}

	// Hanlde total price
	document.getElementById("total-price").innerHTML = "N/A";
	if (selectedTiers.length > 0) {
		if (document.getElementById("id_checkout_type").value === "FIAT") {
			document.getElementById("total-price").innerHTML =
				document
					.getElementById("total-price")
					.getAttribute("data-fiat-currency") + String(totalPrice.toFixed(2));
		}
	}
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
		tierLabel.querySelector(".ticket-tier-total-guests").innerHTML =
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
	var newAmount = amount + 1;
	var newTotalGuests = newAmount * extraParty;

	if (tierInput.hasAttribute("data-guests-available")) {
		if (newTotalGuests > tierInput.getAttribute("data-guests-available")) {
			return;
		}
	}

	if (amount === 0) {
		tierInput.checked = true;
		tierInput.dispatchEvent(new Event("change"));
	} else {
		if (amount < maxPerPerson) {
			if (newAmount <= availability) {
				tierInput.setAttribute("data-amount", newAmount);
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
	var newTotalGuests = amount * (extraParty + 1);

	if (tierInput.hasAttribute("data-guests-available")) {
		if (newTotalGuests > tierInput.getAttribute("data-guests-available")) {
			return;
		}
	}

	if (extraParty < allowedGuests) {
		tierInput.setAttribute("data-extra-party", extraParty + 1);
		updateTier(tierInput);
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

	// Persist checkout type
	// We use try block to make sure app keeps functioning without this minor feature
	// Some browsers may not support URL parameter parsing
	try {
  		var queryString = window.location.search;
		var urlParams = new URLSearchParams(queryString);
		var paramName = urlParams.get("name", "");
		var paramEmail = urlParams.get("email", "");
		var newParams = "?checkout_type=" + tierTypeInput.value;
		if (paramName) {
			newParams += "&name=" + paramName;
		}
		if (paramEmail) {
			newParams += "&email=" + paramEmail;
		}
		window.history.replaceState(null, null, newParams);
	} catch (e) {}
}

function submitForm(event) {
	document
		.getElementById("ticket-tier-error-message")
		.classList.add("d-none");
	if (
		document.getElementById("id_name").checkValidity() &&
		document.getElementById("id_email").checkValidity() &&
		document.getElementById("id_checkout_type").checkValidity()
	) {
		if (document.getElementById("id_ticket_tier_data").value === "") {
			document
				.getElementById("ticket-tier-error-message")
				.classList.remove("d-none");
			event.preventDefault();
		}
	}
}

// Honor persisted checkout type
// We use try block to make sure app keeps functioning without this minor feature
// Some browsers may not support URL parameter parsing

document.addEventListener("DOMContentLoaded", (event) => {
	try {
  		var queryString = window.location.search;
		var urlParams = new URLSearchParams(queryString);
		var paramCheckoutType = urlParams.get("checkout_type", "");
		if (paramCheckoutType) {
			document.getElementById(paramCheckoutType).click();
		}
	} catch (e) {}
});
