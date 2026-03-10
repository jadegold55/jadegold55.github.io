let bunnyFrames = [
    `(\\  _ /)
( ' x ')
c(")(")`,
    `(\\  _ /)
( - x -)
c(")(")`,
    `(\\  _ /)
( ' x ')
c(")(")`,
    `(\\  _ /)
( ^ x ^)
c(")(")`
]
let catFrames = [
    `/\\____/\\
( o  o )
 (") (")_J`,
    `/\\____/\\
( '  ' )
 (") (")_J`,
    `/\\____/\\
( o  o )
 (") (")_J`,
    `/\\____/\\
(='  '=)
 (") (")_J`,
    `/\\____/\\
(=^  ^=)
 (") (")_J`
]


let bunnyIdx = 0;
let catIdx = 0;

const bunny = document.getElementById("bunny-critter");
const cat = document.getElementById("cat-critter");
console.log(bunny, cat);
bunny.textContent = bunnyFrames[0];
cat.textContent = catFrames[0];


setInterval(() => {
    bunnyIdx = (bunnyIdx + 1) % bunnyFrames.length;
    bunny.textContent = bunnyFrames[bunnyIdx];
}, 700);

setInterval(() => {
    catIdx = (catIdx + 1) % catFrames.length;
    cat.textContent = catFrames[catIdx];
}, 600);


