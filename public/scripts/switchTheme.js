function switchTheme() {
    localStorage.setItem('mode', (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark');

    localStorage.getItem('mode') === 'dark' ? (
        document.querySelector('body').classList.add('dark')
    ) : (
        document.querySelector('body').classList.remove('dark')
    );
}