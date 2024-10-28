FROM rust:1-slim-bookworm


WORKDIR /deps

RUN cargo install fnm
RUN fnm use --install-if-missing 20
RUN npm --version
#RUN curl -fsSL https://fnm.vercel.app/install | bash
CMD [ "/bin/bash" ]