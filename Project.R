
## Import Dataset, From text (base), feedback1.txt and feedback2.txt with default settings
## start at the top and click run for each line
## feedback2 is feedback 0 dont ask me why

acc1 <- feedback1$V1
t1 <- feedback1$V2
acc0 <- feedback2$V1
t0 <- feedback2$V2

qqplot(acc1, rt(300, df = 5))

qqnorm(acc1, main = "Normal Q-Q Plot Percentage Accuracy",
       xlab = "Theoretical Quantiles", ylab = "Sample Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(acc1, col = 2)

qqplot(t1, rt(300, df = 5))
qqnorm(t1, main = "Normal Q-Q Plot Percentage Time",
       xlab = "Theoretical Quantiles", ylab = "Sample Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(t1, col = 2)

qqplot(acc0, rt(300, df = 5))
qqnorm(acc0, main = "Normal Q-Q Plot Colour Accuracy",
       xlab = "Theoretical Quantiles", ylab = "Sample Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(acc0, col = 2)

qqplot(t0, rt(300, df = 5))
qqnorm(t0, main = "Normal Q-Q Plot Colour Time",
       xlab = "Theoretical Quantiles", ylab = "Sample Quantiles",
       plot.it = TRUE, datax = FALSE); qqline(t0, col = 2)

t.test(acc1, acc0)
t.test(t1, t0)

var.test(acc1, acc0)
var.test(t1, t0)
