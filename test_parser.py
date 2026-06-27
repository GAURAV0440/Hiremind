from utils.parser import parse_resume

resume_text = parse_resume(
    "uploads/GauravChawla_Resume_AI.pdf"
)

print("\n===== RESUME LENGTH =====")
print(len(resume_text))

print("\n===== FULL RESUME =====\n")
print(resume_text)

print("\n========================")