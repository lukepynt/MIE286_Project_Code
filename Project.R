
## Import Dataset, From text (base), feedback1.txt and feedback2.txt with default settings
## start at the top and click run for each line
## feedback2 is feedback 0 dont ask me why

acc1 <- feedback1$V1
t1 <- feedback1$V2
acc0 <- feedback2$V1
t0 <- feedback2$V2

qqplot(acc1, rt(300, df = 5))

qqnorm(acc1, main = "Normal Q-Q Plot: Percentage Accuracy",
       xlab = "Theoretical Quantiles", ylab = "Accuracy Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(acc1, col = 2)

qqplot(t1, rt(300, df = 5))
qqnorm(t1, main = "Normal Q-Q Plot: Percentage Time",
       xlab = "Theoretical Quantiles", ylab = "Time Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(t1, col = 2)

qqplot(acc0, rt(300, df = 5))
qqnorm(acc0, main = "Normal Q-Q Plot: Colour Accuracy",
       xlab = "Theoretical Quantiles", ylab = "Accuracy Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(acc0, col = 2)

qqplot(t0, rt(300, df = 5))
qqnorm(t0, main = "Normal Q-Q Plot: Colour Time",
       xlab = "Theoretical Quantiles", ylab = "Sample Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(t0, col = 2)

mean(acc1)
var(acc1)
length(acc1)

mean(acc0)
var(acc0)
length(acc0)

mean(t1)
var(t1)

mean(t0)
var(t0)


#t tests

ttacc <- t.test(acc1, acc0)
ttt<-t.test(t1, t0)
print(ttacc)
print(ttt)

# plot 2 t test
library(gginference)
library(mcStats)
ggttest(ttacc)
#showT.Test(acc1, acc0) not as good
ggttest(ttt)

# f tests 
ftacc<-var.test(acc1, acc0)
ftt<-var.test(t1, t0)
print(ftacc)
print(ftt)

# plotting f dist

fcrit <-qf(0.025, 11, 13)
fcrit2<-qf(0.025, 11, 13, lower.tail = FALSE)
curve(df(x, df1=11, df2=13), from=0, to=5, xlab='x', ylab='F(x)')
abline(v=fcrit, col='red', lty=2,)
abline(v=fcrit2, col='red', lty=2)
abline(v=0.81134, col='blue')
abline(v=0.84541, col='blue')
text(0,-0.02, "Fcrit", col = "gray60", adj = c(0, -.1))
text(3.25,-0.02, "Fcrit", col = "gray60", adj = c(0, -.1))
text(1.05,0, "Test stat FB1 = 0.8454", col = "blue", adj = c(0, -.1), srt = 90)
text(0.65,0, "Test stat FB0 = 0.8113", col = "blue", adj = c(0, -.1), srt = 90)




