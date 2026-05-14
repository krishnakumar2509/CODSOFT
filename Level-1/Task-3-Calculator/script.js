let disInput=document.getElementById("input");
display="";
function press(value){
    display+=value;
    disInput.value=display;
}
function clearScreen(){
    disInput.value=""
    display="";
}
function Delete(){
    display=display.slice(0,-1);
    disInput.value=display;
}
function calculate() {
    let result;

    // ADDITION
    if (display.includes("+")) {
        let parts = display.split("+");
        result = 0;

        for (let i = 0; i < parts.length; i++) {
            result += Number(parts[i]);
        }
    }

    // SUBTRACTION
    else if (display.includes("-")) {
        let parts = display.split("-");
        result = Number(parts[0]);

        for (let i = 1; i < parts.length; i++) {
            result -= Number(parts[i]);
        }
    }

    // MULTIPLICATION
    else if (display.includes("*")) {
        let parts = display.split("*");
        result = 1;

        for (let i = 0; i < parts.length; i++) {
            result *= Number(parts[i]);
        }
    }

    // DIVISION
    else if (display.includes("/")) {
        let parts = display.split("/");
        result = Number(parts[0]);

        for (let i = 1; i < parts.length; i++) {
            if (Number(parts[i]) === 0) {
                disInput.value = "Error";
                display = "";
                return;
            }
            result /= Number(parts[i]);
        }
    }

    display = result.toString();
    disInput.value = display;
}