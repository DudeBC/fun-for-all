document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const comments = document.getElementById('comments').value;

        if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || comments.trim() === '') {
            event.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
});
