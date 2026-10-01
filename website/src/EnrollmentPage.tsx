import { useRef,useState, type FormEvent, type ReactNode } from 'react';
import {useSchool,submitForm} from './SchoolContext';

type ApplicationField = 'childName' | 'birthDate' | 'gender' | 'program' | 'guardianName' | 'phone' | 'email' | 'address' | 'previousSchool' | 'medicalConditions' | 'referral';
type ApplicationErrors = Partial<Record<ApplicationField, string>>;

const genderOptions = ['Female', 'Male', 'Other', 'Prefer not to say'];

function ApplicationInput({ name, label, error, children }: { name: ApplicationField; label: string; error?: string; children: ReactNode }) {
  return <div className="application-field"><label htmlFor={`application-${name}`}>{label}</label>{children}
    {error && <small className="application-field-error" id={`application-${name}-error`}>{error}</small>}
  </div>;
}

export default function EnrollmentPage() {
  const {schoolDetails,tuitionFees,records}=useSchool();
  const programOptions=records.filter(r=>r.kind==='programs').map(r=>r.name);
  const [saving,setSaving]=useState(false),[deliveryError,setDeliveryError]=useState('');
  const requestId=useRef(crypto.randomUUID());
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [draft, setDraft] = useState('');
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  function controlProps(name: ApplicationField) {
    return { id: `application-${name}`, name, 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `application-${name}-error` : undefined };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
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

    setSaving(true);setDeliveryError('');
    try{const payload=Object.fromEntries(['childName','birthDate','gender','program','guardianName','phone','email','address','previousSchool','medicalConditions','referral'].map(name=>[name,value(name as ApplicationField)]));const result=await submitForm('admissions',{...payload,requestId:requestId.current});setDraft(result.message??'Your application has been received.');form.reset();requestId.current=crypto.randomUUID();}catch(e){setDeliveryError((e as Error).message);}finally{setSaving(false);}
  }

  return <>
    <section className="page-banner banner-blue application-banner"><div className="container">
      <h1>Enroll your child</h1>
      <p>Apply for admission to Early Childhood Montessori.</p>
    </div></section>
    <section className="application-section"><div className="container">
      <div className="application-layout">
        <form className="application-form" onSubmit={submit} noValidate onChange={event => {
          const target = event.target;
          if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
            const name = target.name as ApplicationField;
            setErrors(previous => ({ ...previous, [name]: undefined }));
          }
          setDraft('');setDeliveryError('');requestId.current=crypto.randomUUID();
        }}>
          <fieldset><legend>Child’s Information</legend>
            <ApplicationInput name="childName" label="Full Name" error={errors.childName}><input {...controlProps('childName')} required maxLength={120} autoComplete="off" /></ApplicationInput>
            <ApplicationInput name="birthDate" label="Date of Birth" error={errors.birthDate}><input {...controlProps('birthDate')} type="date" required max={today} autoComplete="off" /></ApplicationInput>
            <ApplicationInput name="gender" label="Gender" error={errors.gender}><select {...controlProps('gender')} required defaultValue=""><option value="" disabled>Select gender</option>{genderOptions.map(option => <option key={option}>{option}</option>)}</select></ApplicationInput>
            <ApplicationInput name="program" label="Applying for Program" error={errors.program}><select {...controlProps('program')} required defaultValue=""><option value="" disabled>Select a program</option>{programOptions.map(option => <option key={option}>{option}</option>)}</select></ApplicationInput>
          </fieldset>
          <fieldset><legend>Parents/Guardian Information</legend>
            <ApplicationInput name="guardianName" label="Full Name" error={errors.guardianName}><input {...controlProps('guardianName')} required maxLength={120} autoComplete="name" /></ApplicationInput>
            <ApplicationInput name="phone" label="Phone Number" error={errors.phone}><span className="nepal-phone"><span aria-hidden="true">+977</span><input {...controlProps('phone')} onInput={e=>{e.currentTarget.value=e.currentTarget.value.replace(/[^0-9]/g,'');}} type="tel" inputMode="numeric" required pattern="[0-9]{10}" maxLength={10} autoComplete="tel-national" title="Enter exactly 10 digits after +977" /></span></ApplicationInput>
            <ApplicationInput name="email" label="Email address" error={errors.email}><input {...controlProps('email')} type="email" required maxLength={160} autoComplete="email" /></ApplicationInput>
            <ApplicationInput name="address" label="Home address" error={errors.address}><input {...controlProps('address')} required maxLength={250} autoComplete="street-address" /></ApplicationInput>
          </fieldset>
          <fieldset><legend>Additional Information</legend>
            <ApplicationInput name="previousSchool" label="Previous School (if any)" error={errors.previousSchool}><input {...controlProps('previousSchool')} maxLength={160} /></ApplicationInput>
            <ApplicationInput name="medicalConditions" label="Medical Conditions" error={errors.medicalConditions}><input {...controlProps('medicalConditions')} maxLength={400} /></ApplicationInput>
            <ApplicationInput name="referral" label="How did you hear about us?" error={errors.referral}><input {...controlProps('referral')} maxLength={160} /></ApplicationInput>
          </fieldset>
          {Object.values(errors).some(Boolean) && <p className="application-error-summary" role="alert">Please check the highlighted fields before submitting.</p>}
          <button className="application-submit" type="submit" disabled={saving}>{saving?'Submitting…':'Submit Application'}</button>
          {deliveryError&&<p className="application-error-summary" role="alert">{deliveryError}</p>}{draft&&<div className="application-draft-notice" role="status"><p>{draft}</p></div>}
        </form>
        <aside className="application-sidebar" aria-label="Enrollment information">
          <div className="application-tuition"><h2>Monthly tuition</h2><dl>{tuitionFees.map(fee => <div key={fee.program}><dt>{fee.program}</dt><dd>{fee.monthly}/mo</dd></div>)}</dl></div>
          <p className="application-help">Have questions before applying? Call us at <a href={schoolDetails.phoneLink}>{schoolDetails.phone}</a> or visit us during office hours: {schoolDetails.workingDays}, {schoolDetails.workingHours}.</p>
        </aside>
      </div>
      <p className="application-consent">By submitting, you agree to be contacted by our admissions team regarding your application.</p>
    </div></section>
  </>;
}
