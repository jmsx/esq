# Generated by Django 4.0.2 on 2022-02-04 10:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_answer_report_answer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='answer_option',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.optionquestion'),
        ),
    ]