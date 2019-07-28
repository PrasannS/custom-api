//this file contains all auxilliary functions and algorithms which are useful throughout the project

//method to 
const shift = (arr, n) =>{
	var i = 0;
	while(i<n){
		arr.shift();
		i++;
	}
	return arr;
}

module.exports = {
	shift:shift
};