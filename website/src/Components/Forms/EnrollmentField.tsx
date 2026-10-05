import { useState, type FormEvent } from 'react';
import { ApplicationField } from './ApplicationField';

import { SCHOOL_DETAILS } from '@/data/schoolDetails';
import { buildMailto } from '@/lib/mailto';
import { todayISO } from '@/lib/utils';
import type { ApplicationErrors, ApplicationField as FieldName } from '@/types';
import { GENDER_OPTIONS, PROGRAM_OPTIONS } from '@/lib/constants';

const REQUIRED_FIELDS: Array<[FieldName, string]> = [
  ['childName', 'Enter your child’s full name.'],
  ['birthDate', 'Choose your child’s date of birth.'],
  ['gender', 'Choose a gender option.'],
  ['program', 'Choose a program.'],
  ['guardianName', 'Enter the parent or guardian’s full name.'],
  ['phone', 'Enter a 10-digit phone number.'],
  ['email', 'Enter your email address.'],
  ['address', 'Enter your home address.'],
];

export function EnrollmentForm() {
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [draftHref, setDraftHref] = useState('');
  const today = todayISO();

  function controlProps(name: FieldName) {
    return {
      id: `application-${name}`,
      name,
      'aria-invalid': errors[name] ? (true as const) : undefined,
      'aria-describedby': errors[name] ? `application-${name}-error` : undefined,
    };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const value = (name: FieldName) => String(values.get(name) || '').trim();

    const nextErrors: ApplicationErrors = {};
    REQUIRED_FIELDS.forEach(([name, message]) => {
      if (!value(name)) nextErrors[name] = message;
    });

    const birthDate = value('birthDate');
    if (birthDate && birthDate > today) {
      nextErrors.birthDate = 'The date of birth cannot be in the future.';
    }

    const phone = value('phone');
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      nextErrors.phone = 'Use exactly 10 digits, without spaces or the country code.';
    }

    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    if (value('email') && !emailInput.validity.valid) {
      nextErrors.email = 'Enter a valid email address.';
    }

    const gender = value('gender');
    if (gender && !GENDER_OPTIONS.includes(gender as (typeof GENDER_OPTIONS)[number])) {
      nextErrors.gender = 'Choose a gender option from the list.';
    }

    const program = value('program');
    if (program && !PROGRAM_OPTIONS.includes(program as (typeof PROGRAM_OPTIONS)[number])) {
      nextErrors.program = 'Choose a program from the list.';
    }

    setErrors(nextErrors);
    setDraftHref('');

    const firstError = Object.keys(nextErrors)[0] as FieldName | undefined;
    if (firstError) {
      (form.elements.namedItem(firstError) as HTMLElement)?.focus();
      return;
    }

    const body = [
      'ENROLLMENT APPLICATION',
      '',
      'CHILD’S INFORMATION',
      `Full Name: ${value('childName')}`,
      `Date of Birth (YYYY-MM-DD): ${value('birthDate')}`,
      `Gender: ${value('gender')}`,
      `Applying for Program: ${value('program')}`,
      '',
      'PARENT / GUARDIAN INFORMATION',
      `Full Name: ${value('guardianName')}`,
      `Phone Number: +977 ${value('phone')}`,
      `Email Address: ${value('email')}`,
      `Home Address: ${value('address')}`,
      '',
      'ADDITIONAL INFORMATION',
      `Previous School: ${value('previousSchool') || 'Not provided'}`,
      `Medical Conditions: ${value('medicalConditions') || 'Not provided'}`,
      `How did you hear about us?: ${value('referral') || 'Not provided'}`,
      '',
      'I agree to be contacted by the admissions team regarding this application.',
    ].join('\n');

    const href = buildMailto({
      to: SCHOOL_DETAILS.email,
      subject: `Enrollment application — ${value('childName')}`,
      body,
    });
    setDraftHref(href);
    window.location.href = href;
  }

  return (
    <form
      className="min-w-0"
      onSubmit={submit}
      noValidate
      onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
          const name = target.name as FieldName;
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        setDraftHref('');
      }}
    >
      <fieldset className="m-0 mb-14 border-0 p-0 md:mb-[76px]">
        <legend className="mb-7 w-full p-0 font-lora text-2xl font-medium text-brand-blue md:mb-10 md:text-[32px]">
          Child’s Information
        </legend>
        <ApplicationField name="childName" label="Full Name" error={errors.childName}>
          <input
            {...controlProps('childName')}
            required
            maxLength={120}
            autoComplete="off"
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base text-brand-ink transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] [&[aria-invalid='true']]:animate-field-nudge md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="birthDate" label="Date of Birth" error={errors.birthDate}>
          <input
            {...controlProps('birthDate')}
            type="date"
            required
            max={today}
            autoComplete="off"
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base text-brand-ink transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [color-scheme:light] [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="gender" label="Gender" error={errors.gender}>
          <select
            {...controlProps('gender')}
            required
            defaultValue=""
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base text-brand-ink transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          >
            <option value="" disabled>
              Select gender
            </option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </ApplicationField>
        <ApplicationField name="program" label="Applying for Program" error={errors.program}>
          <select
            {...controlProps('program')}
            required
            defaultValue=""
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base text-brand-ink transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          >
            <option value="" disabled>
              Select a program
            </option>
            {PROGRAM_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </ApplicationField>
      </fieldset>

      <fieldset className="m-0 mb-14 border-0 p-0 md:mb-[76px]">
        <legend className="mb-7 w-full p-0 font-lora text-2xl font-medium text-brand-blue md:mb-10 md:text-[32px]">
          Parents / Guardian Information
        </legend>
        <ApplicationField name="guardianName" label="Full Name" error={errors.guardianName}>
          <input
            {...controlProps('guardianName')}
            required
            maxLength={120}
            autoComplete="name"
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="phone" label="Phone Number" error={errors.phone}>
          <input
            {...controlProps('phone')}
            type="tel"
            inputMode="numeric"
            required
            pattern="[0-9]{10}"
            maxLength={10}
            autoComplete="tel-national"
            title="Enter exactly 10 digits"
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="email" label="Email address" error={errors.email}>
          <input
            {...controlProps('email')}
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="address" label="Home address" error={errors.address}>
          <input
            {...controlProps('address')}
            required
            maxLength={250}
            autoComplete="street-address"
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none [&[aria-invalid='true']]:border-[#b62c36] [&[aria-invalid='true']]:bg-[#fff8f8] md:min-h-[54px]"
          />
        </ApplicationField>
      </fieldset>

      <fieldset className="m-0 mb-11 border-0 p-0">
        <legend className="mb-7 w-full p-0 font-lora text-2xl font-medium text-brand-blue md:mb-10 md:text-[32px]">
          Additional Information
        </legend>
        <ApplicationField name="previousSchool" label="Previous School (if any)">
          <input
            {...controlProps('previousSchool')}
            maxLength={160}
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="medicalConditions" label="Medical Conditions">
          <input
            {...controlProps('medicalConditions')}
            maxLength={400}
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none md:min-h-[54px]"
          />
        </ApplicationField>
        <ApplicationField name="referral" label="How did you hear about us?">
          <input
            {...controlProps('referral')}
            maxLength={160}
            className="block min-h-[49px] w-full rounded border-[1.5px] border-[#283349] bg-white px-3.5 py-2.5 text-base transition focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(40,60,130,0.08)] focus:outline-none md:min-h-[54px]"
          />
        </ApplicationField>
      </fieldset>

      {Object.values(errors).some(Boolean) && (
        <p
          role="alert"
          className="animate-notice-enter text-sm text-[#a52530]"
        >
          Please check the highlighted fields before submitting.
        </p>
      )}

      <button
        type="submit"
        className="relative isolate block min-h-[52px] w-full overflow-hidden rounded-md bg-brand-blue px-5 py-3 font-lora text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-lg active:scale-[0.98] md:text-xl"
      >
        Submit Application
      </button>

      <small className="mt-3 block text-center text-[13px] leading-relaxed text-[#536079]">
        This opens an application email for you to send to our admissions team.
      </small>

      {draftHref && (
        <div
          role="status"
          className="mt-4 animate-notice-enter rounded-md bg-[#edf4ff] p-4 text-sm leading-relaxed text-[#243969]"
        >
          <p className="mb-2">
            Your application email is ready. Send it in your email app to complete your submission.
          </p>
          <a
            href={draftHref}
            className="font-semibold underline underline-offset-[3px]"
          >
            Open application email
          </a>
        </div>
      )}
    </form>
  );
}