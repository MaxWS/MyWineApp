// Wine Class
class Wine {
	constructor(winery, name, grape, year, comments) {
		this.winery = winery;
		this.name = name;
		this.grape = grape;
		this.year = year;
		this.comments = comments;
	}
}
// UI Class
class UI {
  addWineToList(wine) {
    const list = document.getElementById('wine-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${wine.winery}</td>
      <td>${wine.name}</td>
      <td>${wine.grape}</td>
      <td>${wine.year}</td>
	  	<td>${wine.comments}</td>
      <td><a href="#" class="delete">X<a></td>
    `;
    // Append table to DOM
    list.appendChild(row);
  }
  clearFields() {
    document.getElementById('winery').value = '';
    document.getElementById('name').value = '';
    document.getElementById('grape').value = '';
    document.getElementById('year').value = '';
    document.getElementById('comments').value = '';
  }
  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get container
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#wine-form');
    // Insert alert
    container.insertBefore(div, form);
    // Timeout after 5 sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 5000);
  }
  deleteWine(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
      // Show message
      this.showAlert('Wine removed!', 'success');
    }
  }
}
// Local Storage Class
class Store {
	static getWines() {
		let wines;
		// Check if there is a 'wines' Array
		if (localStorage.getItem('wines') === null) {
			// If TRUE creates Array
			wines = []
		} else {
			// If FALSE get Array
			wines = JSON.parse(localStorage.getItem('wines'));
		}
		return wines;
	}
	static displayWines() {
		// Fetch wines Array from Local Storage
		const wines = Store.getWines();
		// Loop throw wines Array
		wines.forEach(function(wine) {
			const ui = new UI;
			// Add wine to UI
			ui.addWineToList(wine);
		});

	}
	static addWine(wine) {
		// Fetch wines Array from Local Storage
		const wines = Store.getWines();
		// Add new wine to LS Array
		wines.push(wine);
		// Update LS
		localStorage.setItem('wines', JSON.stringify(wines));
	}
	static removeWine(idnum) {
		// Fetch wines Array from Local Storage
		const wines = Store.getWines();
		// Loop throw wines Array
		wines.forEach(function(wine, index) {
			// If matches, delete
			if (wine.idnum === idnum) {
			  wines.splice(index, 1);
			}
		});
		// Update LS
		localStorage.setItem('wines', JSON.stringify(wines));
	}
}

// Event Listeners //

	// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayWines);
	// Form Event Listeners //
document.getElementById('wine-form').addEventListener('submit', function(e) {
	// Get Form variables values
	const winery = document.getElementById('winery').value;
	const name = document.getElementById('name').value;
	const grape = document.getElementById('grape').value;
	const year = document.getElementById('year').value;
	const comments = document.getElementById('comments').value;


	// Instantiate wine
	const wine = new Wine(winery, name, grape, year, comments);
	// Instantiate UI
	const ui = new UI();

	// Validate
	if(winery === '' || grape === '' || year === '' || comments === '') {
	    // Error alert
	    ui.showAlert('Please fill in all fields', 'error');
	} else {
	    // Add wine to list
		ui.addWineToList(wine);
		// Add wine to Local Storage
		Store.addWine(wine);
	    // Show success
	    ui.showAlert('Wine Added to your List!', 'success');
	  	// Clear fields
		ui.clearFields();
	 }

	e.preventDefault();
});

// Event Listener for delete from UI and LS

  //Add Event Listener to Click button
document.getElementById('wine-list').addEventListener('click', function(e){

  // Instantiate UI
  const ui = new UI();

  // Delete wine from UI
  ui.deleteWine(e.target);

  // Remove from LS
  const idnumToBeRemoved = e.target.parentElement.previousElementSibling.idnum;
  Store.removeWine(idnumToBeRemoved);

  e.preventDefault();
});
