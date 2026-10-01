import { useState, type FormEvent, type ReactNode } from 'react';
import { schoolDetails, tuitionFees } from './schoolDetails';

type ApplicationField = 'childName' | 'birthDate' | 'gender' | 'program' | 'guardianName' | 'phone' | 'email' | 'address' | 'previousSchool' | 'medicalConditions' | 'referral';
type ApplicationErrors = Partial<Record<ApplicationField, string>>;

const programOptions = ['Infant + Toddler', 'Play Group', 'Pre-Nursery', 'Nursery', 'Preschool', 'Lower Kindergarten', 'Upper Kindergarten', 'Primary'];
const genderOptions = ['Female', 'Male', 'Other', 'Prefer not to say'];
const nextSteps = [
  'We review your application within 2 business days.',
  'Our team schedules a short parent interview.',
  'You’ll receive a confirmation and enrollment packet.',
  'Welcome! Your child’s first day is scheduled.',
];

function ApplicationInput({ name, label, error, children }: { name: ApplicationField; label: string; error?: string; children: ReactNode }) {
  return <div className="application-field"><label htmlFor={`application-${name}`}>{label}</label>{children}
    {error && <small className="application-field-error" id={`application-${name}-error`}>{error}</small>}
  </div>;
}

export default function EnrollmentPage() {
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [draft, setDraft] = useState('');
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  function controlProps(name: ApplicationField) {
    return { id: `application-${name}`, name, 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `application-${name}-error` : undefined };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const value = (name: ApplicationField) => String(values.get(name) || '').trim();
    const nextErrors: ApplicationErrors = {};
    const required: [ApplicationField, string][] = [
      ['childName', 'Enter your child’s full name.'], ['birthDate', 'Choose your child’s date of birth.'],
      ['gender', 'Choose a gender option.'], ['program', 'Choose a program.'],
      ['guardianName', 'Enter the parent or guardian’s full name.'], ['phone', 'Enter a 10-digit phone number.'],
      ['email', 'Enter your email address.'], ['address', 'Enter your home address.'],
    ];
    required.forEach(([name, message]) => { if (!value(name)) nextErrors[name] = message; });
    if (value('birthDate') && value('birthDate') > today) nextErrors.birthDate = 'The date of birth cannot be in the future.';
    if (value('phone') && !/^[0-9]{10}$/.test(value('phone'))) nextErrors.phone = 'Use exactly 10 digits, without spaces or the country code.';
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    if (value('email') && !emailInput.validity.valid) nextErrors.email = 'Enter a valid email address.';
    if (value('gender') && !genderOptions.includes(value('gender'))) nextErrors.gender = 'Choose a gender option from the list.';
    if (value('program') && !programOptions.includes(value('program'))) nextErrors.program = 'Choose a program from the list.';
    setErrors(nextErrors);
    setDraft('');
    const firstError = Object.keys(nextErrors)[0] as ApplicationField | undefined;
    if (firstError) {
      (form.elements.namedItem(firstError) as HTMLElement)?.focus();
      return;
    }

    const body = [
      'ENROLLMENT APPLICATION', '', 'CHILD’S INFORMATION',
      `Full Name: ${value('childName')}`, `Date of Birth (YYYY-MM-DD): ${value('birthDate')}`,
      `Gender: ${value('gender')}`, `Applying for Program: ${value('program')}`, '',
      'PARENT / GUARDIAN INFORMATION', `Full Name: ${value('guardianName')}`,
      `Phone Number: +977 ${value('phone')}`, `Email Address: ${value('email')}`,
      `Home Address: ${value('address')}`, '', 'ADDITIONAL INFORMATION',
      `Previous School: ${value('previousSchool') || 'Not provided'}`,
      `Medical Conditions: ${value('medicalConditions') || 'Not provided'}`,
      `How did you hear about us?: ${value('referral') || 'Not provided'}`, '',
      'I agree to be contacted by the admissions team regarding this application.',
    ].join('\n');
    const href = `mailto:${schoolDetails.email}?subject=${encodeURIComponent(`Enrollment application — ${value('childName')}`)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    window.location.href = href;
  }

  return <>
    <section className="page-banner banner-blue application-banner"><div className="container">
      <h1>Enroll your child</h1>
      <p>Take the first step toward a nurturing, Montessori-inspired early education. Fill out the form below and our team will reach out within two business days.</p>
    </div></section>
    <section className="application-section"><div className="container">
      <div className="application-layout">
        <form className="application-form" onSubmit={submit} noValidate onChange={event => {
          const target = event.target;
          if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
            const name = target.name as ApplicationField;
            setErrors(previous => ({ ...previous, [name]: undefined }));
          }
          setDraft('');
        }}>
          <fieldset><legend>Child’s Information</legend>
            <ApplicationInput name="childName" label="Full Name" error={errors.childName}><input {...controlProps('childName')} required maxLength={120} autoComplete="off" /></ApplicationInput>
            <ApplicationInput name="birthDate" label="Date of Birth" error={errors.birthDate}><input {...controlProps('birthDate')} type="date" required max={today} autoComplete="off" /></ApplicationInput>
            <ApplicationInput name="gender" label="Gender" error={errors.gender}><select {...controlProps('gender')} required defaultValue=""><option value="" disabled>Select gender</option>{genderOptions.map(option => <option key={option}>{option}</option>)}</select></ApplicationInput>
            <ApplicationInput name="program" label="Applying for Program" error={errors.program}><select {...controlProps('program')} required defaultValue=""><option value="" disabled>Select a program</option>{programOptions.map(option => <option key={option}>{option}</option>)}</select></ApplicationInput>
          </fieldset>
          <fieldset><legend>Parents/Guardian Information</legend>
            <ApplicationInput name="guardianName" label="Full Name" error={errors.guardianName}><input {...controlProps('guardianName')} required maxLength={120} autoComplete="name" /></ApplicationInput>
            <ApplicationInput name="phone" label="Phone Number" error={errors.phone}><input {...controlProps('phone')} type="tel" inputMode="numeric" required pattern="[0-9]{10}" maxLength={10} autoComplete="tel-national" title="Enter exactly 10 digits" /></ApplicationInput>
            <ApplicationInput name="email" label="Email address" error={errors.email}><input {...controlProps('email')} type="email" required maxLength={160} autoComplete="email" /></ApplicationInput>
            <ApplicationInput name="address" label="Home address" error={errors.address}><input {...controlProps('address')} required maxLength={250} autoComplete="street-address" /></ApplicationInput>
          </fieldset>
          <fieldset><legend>Additional Information</legend>
            <ApplicationInput name="previousSchool" label="Previous School (if any)" error={errors.previousSchool}><input {...controlProps('previousSchool')} maxLength={160} /></ApplicationInput>
            <ApplicationInput name="medicalConditions" label="Medical Conditions" error={errors.medicalConditions}><input {...controlProps('medicalConditions')} maxLength={400} /></ApplicationInput>
            <ApplicationInput name="referral" label="How did you hear about us?" error={errors.referral}><input {...controlProps('referral')} maxLength={160} /></ApplicationInput>
          </fieldset>
          {Object.values(errors).some(Boolean) && <p className="application-error-summary" role="alert">Please check the highlighted fields before submitting.</p>}
          <button className="application-submit" type="submit">Submit Application</button>
          <small className="application-delivery-note">This opens an application email for you to send to our admissions team.</small>
          {draft && <div className="application-draft-notice" role="status"><p>Your application email is ready. Send it in your email app to complete your submission.</p><a href={draft}>Open application email</a></div>}
        </form>
        <aside className="application-sidebar" aria-label="Enrollment information">
          <div className="application-next"><h2>What Happens Next</h2><ol>{nextSteps.map(step => <li key={step}>{step}</li>)}</ol></div>
          <div className="application-tuition"><h2>Tuition Quick Reference</h2><dl>{tuitionFees.map(fee => <div key={fee.program}><dt>{fee.program}</dt><dd>{fee.monthly}/mo</dd></div>)}</dl></div>
          <p className="application-help">Have questions before applying? Call us at <a href={schoolDetails.phoneLink}>{schoolDetails.phone}</a> or visit us during office hours: {schoolDetails.workingDays}, {schoolDetails.workingHours}.</p>
        </aside>
      </div>
      <p className="application-consent">By submitting, you agree to be contacted by our admissions team regarding your application.</p>
    </div></section>
  </>;
}
