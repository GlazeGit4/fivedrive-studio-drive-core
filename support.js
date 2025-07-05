function copySupportEmail() {
  const field = document.getElementById("emailField");
  field.select();
  field.setSelectionRange(0, 99999); // Mobile support
  document.execCommand("copy");

  alert("Support email copied to clipboard!");
}
