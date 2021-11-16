function update() {
	const result = document.getElementById("result");
	
	const sA = parseFloat(document.getElementById("sideA").value);
	const sB = parseFloat(document.getElementById("sideB").value);
	const sC = parseFloat(document.getElementById("sideC").value);
	
	if (sA <=0 || sB <=0 || sC <= 0 || 
		sA + sB < sC || sA + sC < sB || sB + sC < sA) {
			result.innerHTML = "<img src=\"pictures/triangle/tr-4.jpg\" width=\"100px \" height=\"100px \">";
			return;
	}
	
	if (sA === sB && sA === sC) {
		result.innerHTML = "<img src=\"pictures/triangle/tr-3.jpg\" width=\"100px \" height=\"100px \">";
		return;
	}
	
	if (sA === sB || sA === sC || sB === sC) {
		result.innerHTML = "<img src=\"pictures/triangle/tr-2.jpg\" width=\"100px \" height=\"100px \">";
		return;
	}
	
	result.innerHTML = "<img src=\"pictures/triangle/tr-1.jpg\" width=\"100px \" height=\"100px \">";
}



