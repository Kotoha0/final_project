document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section'); // All sections
    const navLinks = document.querySelectorAll('#nav-bar a'); // All navigation links

    // Function to show the selected section and hide others
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden'); // Show the selected section
            } else {
                section.classList.add('hidden'); // Hide other sections
            }
        });
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const sectionId = e.target.getAttribute('data-section'); // Get the target section ID
            showSection(sectionId); // Show the corresponding section
        });
    });

    // Initialize: Show the first section by default
    showSection('my-recipe-notes');
});