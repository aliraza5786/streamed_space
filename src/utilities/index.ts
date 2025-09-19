export function getInitials(name: string) {
    console.log(name);
    
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
