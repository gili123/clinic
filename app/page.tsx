"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import createCache from '@emotion/cache'
import { prefixer } from 'stylis';
import { createTheme } from '@mui/material/styles'
import rtlPlugin from 'stylis-plugin-rtl'
import { CacheProvider } from '@emotion/react';
import profilePic from '../public/SHEBA_LOGO_HEB_new.png'
import { Button, TextField, ThemeProvider, Typography } from "@mui/material"
import { useLogin } from "./hooks/useLogin";
import { useRouter } from 'next/navigation';

const theme = createTheme({
  direction: 'rtl',
});

// Create rtl cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

enum Progress {
  LOGIN,
  VERIFY
}

export default function Home() {
  const [phone, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('')
  const [progress, setProgress] = useState<Progress>(Progress.LOGIN);
  const [loading, setLoading] = useState(false);
  const { login, verify } = useLogin();
  const router = useRouter();

  useEffect(() => {
    setPhoneError('')
  }, [phone])

  useEffect(() => {
    setNameError('')
  }, [name])

  useEffect(() => {
    setCodeError('')
  }, [code])

  const validatePhone = (phone: string): string => {
    const regexPhone = new RegExp("^((\\+972[- ]?|0)([23489]|5[0123456789])\\d{7}|\\+?[1-9]\\d{1,14})$")
    var error = ''
    if (!regexPhone.test(phone)) {
      error = 'טלפון לא חוקי'
    }
    setPhoneError(error)
    return error
  }

  const validateName = (name: string): string => {
    const regexName = new RegExp("^(?=(?:.*[a-zA-Zא-ת]){2})[a-zA-Zא-ת\\s]{2,15}$")
    var error = ''
    if (!regexName.test(name)) {
      error = 'שם חייב להיות בין 2 ל 15 תווים וצריך להכיל רק אותיות באנגלית או בעברית'
    }
    setNameError(error)
    return error
  }

  const validateCode = (code: string): string => {
    const regexCode = new RegExp("^[0-9]{4}$")
    var error = ''
    if (!regexCode.test(code)) {
      error = 'קוד לא חוקי'
    }
    setCodeError(error)
    return error
  }

  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!!validateName(name) || !!validatePhone(phone)) {
      return;
    }

    setLoading(true);
    login(name, phone)
      .then(data => {
        setProgress(Progress.VERIFY)
        setLoading(false);
      })
      .catch(error => {
        console.error(error.message)
        alert(error.message)
        setLoading(false);
      });
  };

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!!validateCode(code)) {
      return;
    }

    setLoading(true);
    verify(phone, code)
      .then(data => {
        if(data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        setLoading(false);
      })
      .catch(error => {
        setCodeError(error.message);
        setLoading(false);
      });
  };

  const renderLogin = () => {
    return (
      <>
        <TextField 
          id="name" 
          label="שם" 
          variant="outlined" 
          type="text" 
          required 
          value={name} 
          error={!!nameError} 
          helperText={nameError} 
          onChange={(e) => setName(e.target.value)}
        />
        <TextField 
          id="phone-number" 
          label="מספר טלפון" 
          variant="outlined"
          error={!!phoneError} 
          helperText={phoneError} 
          required
          value={phone} 
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </>
    )
  }

  const renderVerify = () => {
    return (
      <>
        <TextField 
          id="enter-code" 
          label="הכנס קוד" 
          variant="outlined" 
          type="text" 
          required 
          value={code}
          error={!!codeError} 
          helperText={codeError} 
          onChange={(e) => setCode(e.target.value)}
        />
        <Typography
          variant="body2"
          color="primary"
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={() => login(name, phone)}
        >
          לא קיבלתי קוד, שלח שוב
        </Typography>
      </>
    )
  }

  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
          <div dir="rtl" className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 opacity-95">
        <form onSubmit={progress === Progress.LOGIN ? handlePhoneSubmit : handleCodeSubmit} className="flex flex-col inset-0 z-[1] gap-4 w-full max-w-sm bg-white py-12 px-6 rounded-lg shadow-md border border-gray-300 ">
          <Image className="mx-auto"
            src={profilePic}
            alt="Picture of the author"
            width={200}
            height={200}
          />
          <Typography variant="h5" color="black" fontWeight="bold">
            התחבר
          </Typography>
          {progress === Progress.LOGIN ? renderLogin() : renderVerify()}
          <Button variant="contained" color="primary" type="submit" loading={loading}>
            {progress === Progress.LOGIN ? 'התחבר' : 'שלח'}
          </Button>
        </form>
      </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
