// This acts like your 'public static void main' - it waits for the button click
document.getElementById('calculateBtn').addEventListener('click', function() {
    
    // 1. USER INPUT (Replacing your Scanner)
    const guestName = document.getElementById('guestName').value || "Guest";
    const roomType = document.getElementById('roomType').value; // e.g., 'standard', 'standard-vip'
    const roomQty = parseInt(document.getElementById('roomQuantity').value);
    const isReturning = document.getElementById('isReturning').checked; // Replacing the ArrayList check

    // Safety constraint from your Java code
    if (roomQty < 1 || roomQty > 30) {
        alert("Please enter a room quantity between 1 and 30.");
        return; 
    }

    // 2. CALCULATIONS (Direct translation of your Java logic)
    let baseCost = 0;
    let disCost = 0;
    let tierDiscountPercent = 0;

    switch (roomType) {
        case "standard":
            baseCost = roomQty * 400;
            if (roomQty > 10) {
                disCost = baseCost - (baseCost * 0.5);
                tierDiscountPercent = 50;
            } else if (roomQty > 5) {
                disCost = baseCost - (baseCost * 0.12);
                tierDiscountPercent = 12;
            } else {
                disCost = baseCost;
            }
            break;

        case "standard-vip":
            baseCost = roomQty * 600;
            if (roomQty > 10) {
                disCost = baseCost - (baseCost * 0.5);
                tierDiscountPercent = 50;
            } else if (roomQty > 5) {
                disCost = baseCost - (baseCost * 0.3);
                tierDiscountPercent = 30;
            } else if (roomQty > 2) {
                disCost = baseCost - (baseCost * 0.1);
                tierDiscountPercent = 10;
            } else {
                disCost = baseCost;
            }
            break;

        case "high-vip":
            baseCost = roomQty * 1000;
            if (roomQty > 10) {
                disCost = baseCost - (baseCost * 0.4);
                tierDiscountPercent = 40;
            } else if (roomQty > 2) {
                disCost = baseCost - (baseCost * 0.1);
                tierDiscountPercent = 10;
            } else {
                disCost = baseCost;
            }
            break;
            
        default:
            alert("Invalid Choice!! Try Again");
            return;
    }

    // Returning Customer Check (Replacing your users.contains check)
    let finalCost = disCost;
    if (isReturning) {
        finalCost = disCost - (disCost * 0.03);
    }

    // 3. DISPLAY RESULTS (Replacing your System.out.println)
    document.getElementById('displayGuest').textContent = guestName;
    document.getElementById('displayBase').textContent = `R ${baseCost.toFixed(2)}`;
    document.getElementById('displayTierDiscount').textContent = `-${tierDiscountPercent}%`;
    document.getElementById('displayLoyalty').textContent = isReturning ? "Yes (-3%)" : "No";
    document.getElementById('displayTotal').textContent = `R ${finalCost.toFixed(2)}`;

    // Activate the Confirm Button
    const confirmBtn = document.querySelector('.receipt-panel .btn-secondary');
    confirmBtn.disabled = false;
    confirmBtn.style.backgroundColor = '#01B574'; 
    confirmBtn.style.color = 'white';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.textContent = 'Confirm Booking';
});