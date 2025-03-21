document.addEventListener("DOMContentLoaded", function () {
    const createEmployeeBtn = document.querySelector(".create-container");
    if (createEmployeeBtn) {
        createEmployeeBtn.addEventListener("click", createEmployeeModal);
    }

    function createEmployeeModal() {
        // Check if modal already exists
        if (document.querySelector(".modal-overlay")) return;
        const modal = document.createElement("div");
        modal.classList.add("modal-overlay");
        modal.innerHTML = `
            <div class="modal">
                <span class="close-btn">&times;</span>
                <h2>თანამშრომლის დამატება</h2>
                <label for="employee-name">სახელი:</label>
                <input type="text" id="employee-name" placeholder="შეიყვანეთ სახელი">
                <label for="employee-surname">გვარი:</label>
                <input type="text" id="employee-surname" placeholder="შეიყვანეთ გვარი">
                
                <label for="employee-department">დეპარტამენტი:</label>
                <input type="text" id="employee-department" placeholder="შეიყვანეთ დეპარტამენტი">
                
                <button id="save-employee">შენახვა</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Close modal on button click
        modal.querySelector(".close-btn").addEventListener("click", function () {
            modal.remove();
        });
        // Close modal when clicking outside
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.remove();
            }
        });

        document.getElementById("save-employee").addEventListener("click", function () {
            const name = document.getElementById("employee-name").value.trim();
            const department = document.getElementById("employee-department").value.trim();

            if (!name || !department) {
                alert("გთხოვთ შეიყვანოთ ყველა ველი!");
                return;
            }

            modal.remove();
        });
    }
});
