const formElement = document.querySelector("#checkout-form");
const errorElement = document.querySelector("#checkout-form-error");
const modalElement = document.querySelector("#checkout-form-price-modal");
const modalBodyElement = document.querySelector("#checkout-form-price-modal-body");

const roomData = {
  "queen": {
    occupancy: 5,
    cost: {
      default: 150,
      juneThruAug: 250
    }
  },
  "king": {
    occupancy: 2,
    cost: {
      default: 150,
      juneThruAug: 250
    }
  },
  "two-bed": {
    occupancy: 6,
    cost: {
      default: 210,
      juneThruAug: 350
    }
  }
}

const discountMap = {
  "discount-none": 0,
  "discount-aaa-senior": .1,
  "discount-military": .2
}

const getRoomRate = (checkInDate, roomType) => {
  const month = checkInDate.getMonth();
  const isJuneThruAug = month >= 6 && month <= 8;

  return roomData[roomType].cost[isJuneThruAug ? "juneThruAug" : "default"] 
}

const setError = (msg) => {
  errorElement.style.display = msg ? "block" : "none";
  errorElement.textContent = msg;
}

const populatePriceModal = (priceData) => {
  const elementMap = {
    roomCost: {
      id: "#modal-room-cost",
      display: true,
    },
    discount: {
      id: "#modal-discount",
      display: priceData.discount
    },
    discountedCost: {
      id: "#modal-discounted-cost",
      display: priceData.discount
    },
    tax: {
      id: "#modal-tax",
      display: true
    },
    totalCost: {
      id: "#modal-total-cost",
      display: true
    }
  }

  for(const [key, value] of Object.entries(priceData)) {
    const element = document.querySelector(elementMap[key].id);
    const containerElement = document.querySelector(`${elementMap[key].id}-container`);

    if(containerElement && elementMap[key].display) {
      containerElement.style.display = "block"
    } else if(containerElement) {
      containerElement.style.display = "none"
    }

    element.innerText = "$" + value.toFixed(2); 
  }
}

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  setError(null);

  const formData = new FormData(formElement);

  const name = formData.get("name");
  const email = formData.get("email");
  const arrivalDate = new Date(formData.get("arrival_date"));
  const duration = Number(formData.get("duration"));
  const roomType = formData.get("room_type");
  const adultNumber = Number(formData.get("adult_number"));
  const childNumber = Number(formData.get("child_number"));
  const discountSelection = formData.get("discount");

  const guestNumber = adultNumber + childNumber;

  if(!adultNumber && !childNumber) {
    setError("Party must have at least one member!")
    return;
  } else if(guestNumber > roomData[roomType].occupancy) {
    setError("The room you selected will not hold your party!")
    return;
  }

  const roomCost = getRoomRate(arrivalDate, roomType) * duration;
  const discount = roomCost * discountMap[discountSelection];
  const discountedCost = roomCost - discount;
  const tax = discountedCost * .12;
  const totalCost = discountedCost + tax;

  populatePriceModal({
    roomCost,
    discount,
    discountedCost,
    tax,
    totalCost
  })

  const priceModal = new bootstrap.Modal(modalElement)
  priceModal.show();
})
