# Simple function hooking with Frida

## Introduction
What is function hooking? It is a procedure that allows you to get notified when a function has been called and/or is about to return. At that point you have the option to read the parameters, change variables, return a different value, etc. While having access to the code helps, you can hook OS calls even if you only have the compiled binary.

What is [frida](https://frida.re)? It is a dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers. We will use it to inject JavaScript into a native apps on Linux (curl) to allow us to explore it superficially but it can be used for a **lot** more!

What is [curl](https://curl.se/)? It is a command lines tool to transfer data. We will be using it to send a HTTP Request and get a HTTP Response but it can be used for a **lot** more!

## Setup 
This exercise is designed to run on a Linux computer (or VM). Install the following:

```
sudo apt install pip
pip install frida-tools
```

You might also need to add frida install dir to path. In my case it was installed in ```/home/student/.local/bin```, so in order to add it to the path temporarily you can use: 
```
export PATH="$PATH:/home/student/.local/bin"
```
or else to make the change permanent, enter the command above into your home directory's ```.bashrc``` file (e.g. /home/student/.bashrc).

## Files in this directory
### Handlers
All the JS files are under ```/__handlers__``` directory. Since we will be using only functions from libpthread library, all the handlers are under ```/__handlers__/libpthread_2.31.so```. Frida uses one JS handler for each function, this exercise uses a total of 5. Each handler has 2 JS functions in it:

- onEnter(): triggered as soon as the hooked function is called. This allows you to know the sequence in which functions are called, the value of the parameters, etc.
- onLeave(): triggered just before the hooked function returns. This allows you to check/change the return value, read buffers that were modified by the function, etc.

### Options
The files with ```.opt``` extension are the frida-trace command line options for our scenarios.

### Sample outputs
The files with ```.log``` extension are the output of frida-trace for our scenarios.

## Scenario A : Basic HTTP hooking
By default curl will display the HTTP Response body. Let's say we need to see the HTTP Request it is sending and the full HTTP Response. In this case we need to hook the ```send()``` and ```recv()``` functions and dump the buffers.

On entering ```send()``` we will output the contents of the buffer, using the length parameter to know where to stop. On leaving ```recv()``` we will output the buffer again, this time using the return value to tell us how much to print.

## Scenario B : HTTPS hooking
If we try the settings for Scenario A on a HTTPS website, we would not get any output. This indicates that when encrypting is involved, curls does not use send/recv but something else. In this case we will have to  hook the ```write()``` and ```read()``` functions instead. This time there is more traffic and it is not readable since HTTPS uses encryption. 

## Scenario C : Tricking curl
Here we will be hooking the ```connect()``` function, and on leaving we will modify the return value to -1 so that curl thinks that the connection failed.

## Running the scenarios
To run the scenarios, simply call one of the following (for the respective scenario):
```
frida-trace -O a.opt
frida-trace -O b.opt
frida-trace -O c.opt
```

## Practical research applications
1. Hooking functions to capture (and modify) communication between application and the Internet/OS. One such application is to disable certificate validation to allow an app to connect to untrusted HTTPS and skip cert pinning. See: [MCAST dissertation by Angele Aquilina](https://fb.watch/9gtabNlVvI/) and [Defeating Android Certificate Pinning with Frida](https://httptoolkit.tech/blog/frida-certificate-pinning/).
1. Dynamic analysis of malware, e.g. monitoring system calls originating from JS engines. See: [Casting exploit analysis as a Weird Machine reconstruction problem](https://arxiv.org/abs/2109.13100).
1. Runtime Verification (RV) of secure applications such as chat apps or browsers using HTTPS. RV can be used to make sure that decrypted data is not leaked, checking that memory containing decryption keys is scrubbed before freeing buffers, etc. See: [RV-TEE: secure cryptographic protocol execution based on runtime verification](https://link.springer.com/article/10.1007%2Fs11416-021-00391-1) and [Secure Implementation of a
Quantum-Future GAKE Protocol](http://staff.um.edu.mt/__data/assets/pdf_file/0006/479202/STM21.pdf).

## Functions reference
- [ssize_t send(int sockfd, const void *buf, size_t len, int flags);](https://man7.org/linux/man-pages/man2/send.2.html)
- [ssize_t recv(int sockfd, void *buf, size_t len, int flags);](https://man7.org/linux/man-pages/man2/recv.2.html)
- [ssize_t read(int fd, void *buf, size_t count);](https://man7.org/linux/man-pages/man2/read.2.html)
- [ssize_t write(int fd, const void *buf, size_t count);](https://man7.org/linux/man-pages/man2/write.2.html)
- [int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);](https://man7.org/linux/man-pages/man2/connect.2.html)
