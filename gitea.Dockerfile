FROM gitea/gitea:latest
USER root
RUN git config --global user.name "Cheang Yuheng, Kane" && \
    git config --global user.email "2302033@sit.singaporetech.edu.sg"
# Ensure correct permissions for /data
RUN chown -R 1000:1000 /data
USER git
